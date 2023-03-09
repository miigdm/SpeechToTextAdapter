/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-const-assign */
/* eslint-disable func-names */
/**
* (C) Copyright IBM Corporation 2018.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
const alawmulaw = require('alawmulaw');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
// const SpeechToTextEngine = require('./SpeechToTextEngine');
const Config = require('../config');

const LOG_LEVEL = Config.variables.LogLevel;
const logger = require('pino')({ level: LOG_LEVEL, name: 'WatsonSpeechToTextEngine' });

logger.debug(Config.variables.LogLevel);
// const AzureSpeechToTextCredentials = Config.get('AzureSpeechToText.credentials');
// const { subscriptionKey, serviceRegion, language } = AzureSpeechToTextCredentials;


class AzureSpeechToTextEngine {
  /**
   * Creates an instace of the WatsonSpeechToTextEngine, for a full list of config parameters
   * See https://console.bluemix.net/docs/services/speech-to-text/summary.html#summary
   * @param {Object} config - Configuration object
   * @param {String} config.subscriptionKey - Model to use, usually en-US_NarrowbandModel
   * @param {String} config.serviceRegion - Model to use, usually en-US_NarrowbandModel
   * @param {String} config.language - Model to use, usually en-US_NarrowbandModel
   * @param {String} config.hostname-type - Content type to use, usually 'audio/basic' for mulaw
   * @returns {StreamTranscription} StreamTranscript - Returns a readable stream
   */
  constructor(config = {}, sendTranscription) {
    // super();

    /* eslint-disable no-param-reassign */
    // Convert to camelCase to fit SDK options
    const pushStream = sdk.AudioInputStream.createPushStream(sdk.AudioStreamFormat.getWaveFormatPCM(8000, 16, 1));
    this.stream = pushStream;
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const speechConfig = sdk.SpeechConfig.fromSubscription(config.subscriptionKey, config.serviceRegion);
    speechConfig.speechRecognitionLanguage = config.language;
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    logger.debug(this.stream);
    recognizer.recognizeOnceAsync(
      (result) => {
        logger.debug('transcript result:', result.text);
        recognizer.close();
        recognizer = undefined;
        sendTranscription(result.text);
      },
      (err) => {
        recognizer.close();
        recognizer = undefined;
        logger.debug(err);
        logger.trace(`err - ${err}`);
      },
    );
    // return AzureSpeechToTextEngine;
  }

  pushData(data) {
    if (data && data.length) {
      logger.debug('entro');
      const streampayload = alawmulaw.mulaw.decode(data);
      const pcmdata = Buffer.from(streampayload.buffer);
      this.stream.write(pcmdata.buffer);
    }
  }

  // eslint-disable-next-line no-unused-vars
  exit() {
    this.stream.close();
  }
  /* eslint-disable class-methods-use-this */
  // _read() {}

  // _write() {}
}
module.exports = AzureSpeechToTextEngine;
