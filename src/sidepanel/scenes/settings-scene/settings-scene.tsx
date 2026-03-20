import { useCallback, useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel } from '../../components/panel/panel';
import classes from './settings-scene.module.css';
import { clsx } from 'clsx';
import { Typography } from '../../components/typography/typography';
import { Switch } from '../../components/switch/switch';
import { Label } from '../../components/label/label';
import { SanitizedText } from '../../components/sanitized-text/sanitized-text';
import ArrowLeftIcon from '../../components/icons/arrow-left-icon.svg?react';
import { Button } from '../../components/button/button';
import { Stack } from '../../components/stack/stack';
import { useNavigate } from 'react-router-dom';
import { prepareSummarizer } from '../../utils/prepare-summarizer.util';
import { summarizerStatus } from '../../signals/summarizer-status.signal';
import { useStorage } from '../../hooks/use-storage';
import { SETTINGS_USE_AI_GENERATED_DESCRIPTIONS } from '../../../shared/constants/storage';
import { useAlert } from '../../components/alert-provider/hooks/use-alert';
import { UNSUPPORTED_MESSAGE_TYPE } from '../../../shared/constants/error-messages';
import { useSignals } from '@preact/signals-react/runtime';
import { Progress } from '../../components/progress/progress';
import { Error as ErrorComponent } from '../../components/error/error';
import { Separator } from '../../components/separator/separator';
import { CHECK_INTERVAL, FIVE_MINUTES } from './constants';
import { SUMMARIZER_OPTIONS } from '../../../shared/constants/summarizer';
import { getSummarizerAvailability } from '../../utils/get-summarizer-availability.util';
import { Alert } from '../../components/alert/alert';

export const SettingsScene: FC = () => {
  useSignals();

  const { t } = useTranslation('settings-scene');
  const navigate = useNavigate();
  const {
    value: storageValue,
    setValue: setStorageValue,
    loading: storageLoading,
  } = useStorage(SETTINGS_USE_AI_GENERATED_DESCRIPTIONS, false);
  const { error: errorAlert } = useAlert();
  const [hasErrored, setHasErrored] = useState(false);
  const lastReportedAtTimestamp = summarizerStatus.value?.timestamp;

  const isSummarizerSupported = !!Summarizer;

  const handleEnableSummarizer = useCallback(async (): Promise<void> => {
    try {
      await prepareSummarizer(SUMMARIZER_OPTIONS);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : UNSUPPORTED_MESSAGE_TYPE;

      errorAlert(t(`common:error-messages.${errorMessage}`));
    }
  }, [errorAlert, t]);

  const isSummarizerReady = useCallback(async (): Promise<boolean> => {
    const availability = await getSummarizerAvailability();

    if (!availability) {
      return false;
    }

    return availability === 'available';
  }, []);

  const handleUseAiGeneratedDescriptionsChange = useCallback(
    async (value: boolean) => {
      setStorageValue(value);
      const isReady = await isSummarizerReady();

      if (value && !isReady) {
        handleEnableSummarizer();
      }
    },
    [handleEnableSummarizer, isSummarizerReady, setStorageValue],
  );

  useEffect(() => {
    if (!lastReportedAtTimestamp) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const last = new Date(lastReportedAtTimestamp).getTime();

      if (now - last > FIVE_MINUTES) {
        setHasErrored(true);
        clearInterval(interval);
      }
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [lastReportedAtTimestamp]);

  useEffect(() => {
    /**
     * Re-check Summarizer availability on first render.
     * If AI generated descriptions were enabled but AI Model
     * got deleted or became unavailable in a meanwhile,
     * disable Use AI generated descriptions toggle through
     * changing its value in the store.
     */

    const checkAvailability = async () => {
      const availability = await getSummarizerAvailability();

      if (
        availability !== 'available' &&
        availability !== 'downloading' &&
        storageValue
      ) {
        setStorageValue(false);
      }
    };

    checkAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={16}>
      <div>
        <Button
          icon={<ArrowLeftIcon />}
          variant="secondary"
          outlined
          onClick={() => navigate('/')}
        >
          {t('navigate-back')}
        </Button>
      </div>

      <Panel align="left">
        <form className={clsx(classes.form)}>
          <div className={classes.formRow}>
            <Label
              disabled={!isSummarizerSupported}
              htmlFor="use-ai-generated-descriptions"
            >
              {t('use-ai-generated-descriptions.label')}
            </Label>

            <Switch
              id="use-ai-generated-descriptions"
              disabled={!isSummarizerSupported || storageLoading}
              checked={storageValue}
              onCheckedChange={handleUseAiGeneratedDescriptionsChange}
            />
          </div>
          <Typography
            variant="secondary"
            size="small"
            disabled={!isSummarizerSupported}
          >
            <SanitizedText text={t('use-ai-generated-descriptions.info')} />
          </Typography>

          {summarizerStatus.value?.isDownloading && (
            <Stack gap={12}>
              <Separator />

              <Typography noMargin variant="secondary">
                <SanitizedText
                  text={t('use-ai-generated-descriptions.downloading', {
                    count: summarizerStatus.value?.value ?? 0,
                  })}
                />
              </Typography>

              <Progress value={summarizerStatus.value?.value ?? 0} />

              {hasErrored && (
                <ErrorComponent dark>
                  {t('use-ai-generated-descriptions.error')}
                </ErrorComponent>
              )}
            </Stack>
          )}

          {summarizerStatus.value?.value === 100 &&
            !summarizerStatus.value.isDownloading && (
              <Alert variant="success">
                <SanitizedText
                  text={t(
                    'use-ai-generated-descriptions.model-successfully-downloaded',
                  )}
                />
              </Alert>
            )}
        </form>
      </Panel>
    </Stack>
  );
};
