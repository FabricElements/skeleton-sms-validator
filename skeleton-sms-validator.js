import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import './encoder-utils.js';

/* eslint-disable max-len */

/**
 * `skeleton-sms-validator`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonSmsValidator extends PolymerElement {
  /**
   * Template element
   * @return {!HTMLTemplateElement}
   */
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }

      #text-box {
        display: block;
        position: relative;
      }

      paper-textarea[invalid] {
        --paper-input-container-input: {
          outline: var(--paper-red-500);
        }
      }

      #text-box-footer {
        @apply --layout-horizontal;
      }

      #message-type {
        @apply --paper-font-caption;
        background-color: var(--paper-grey-900);
        color: white;
        font-weight: bold;
        border-radius: 5px;
        padding: 0 5px;
      }

      #message-segments {
        @apply --paper-font-caption;
      }

      .char-counter {
        color: var(--paper-indigo-900);
        @apply --paper-font-caption;
      }

      .char-counter[invalid] {
        color: var(--paper-red-500);
      }

      .char-counter p {
        margin: 0;
      }

      .character {
        border-radius: 5px;
        border: 1px solid white;
        color: white;
        display: inline-block;
        font-size: 14px;
        height: 1.5em;
        line-height: 1.5;
        text-align: center;
        vertical-align: top;
        width: 1.5em;
      }

      #message-type.gsm,
      .gsm {
        background-color: var(--paper-grey-900);
      }

      .gsm.double-true {
        background-color: var(--paper-indigo-500);
      }

      #message-type.ucs2,
      .ucs2 {
        background-color: var(--paper-deep-orange-500);
      }

      .divider {
        @apply --layout-flex-auto;
      }
    </style>
    <div id="text-box">
      <paper-textarea label="Message"
                      value="{{value}}"
                      invalid$="[[invalid]]"
                      always-float-label="[[alwaysFloatLabel]]"
                      id="sms-textarea">
      </paper-textarea>
      <div id="text-box-footer">
        <span id="message-type" class\$="[[type]]">
          [[type]]
          <paper-tooltip>Message type</paper-tooltip>
        </span>
        <div class="divider"></div>
        <span id="message-segments">
          [[segments]] / [[limitSegments]]
          <paper-tooltip>Segments</paper-tooltip>
        </span>
        <div class="divider"></div>
        <span class="char-counter" invalid\$="[[invalid]]">[[charCounter]] / [[_limit]]</span>
      </div>
    </div>
    <div><slot name="tags"></slot></div>
    <div class="message">
      <p class="message-data">
        <template is="dom-repeat" items="[[characters]]">
          <span class\$="character [[item.encode]] double-[[item.double]]">
            [[item.text]]
            <paper-tooltip>[[_labelCharacter(item)]]</paper-tooltip>
          </span>
        </template>
      </p>
    </div>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-sms-validator';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      /**
       * The encoding type
       */
      type: {
        type: String,
        value: null,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * SMS chars array
       */
      characters: {
        type: Array,
        value: [],
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * SMS parts
       */
      segments: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * True if SMS parts exceed limitSegments
       */
      invalid: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * The text value
       */
      value: {
        type: String,
        value: null,
        notify: true,
        reflectToAttribute: true,
        observer: '_textObserver',
      },
      /**
       * Limits the parts an SMS should have
       */
      limitSegments: {
        type: Number,
        value: 2,
      },
      /**
       * The input char counter
       */
      charCounter: {
        type: Array,
        value: [],
        readOnly: true,
        computed: '_computeCharCounter(characters)',
      },
      /**
       * Limits the char qty by encoding type and segments limit
       */
      _limit: {
        type: Number,
        value: 0,
        readOnly: true,
        computed: '_computeLimit(segments, type, limitSegments)',
      },
      /**
       * GSM label
       */
      labelGsm: {
        type: String,
        value: 'GSM character',
      },
      /**
       * GSM double chars label
       */
      labelGsmDouble: {
        type: String,
        value: 'GSM character that costs two characters',
      },
      /**
       * UCS2 label
       */
      labelUcs2: {
        type: String,
        value: 'Character forces UCS2 encoding',
      },
      /**
       * Always float label
       */
       alwaysFloatLabel: {
        type: Boolean,
        value: false,
      },
      cursorStart: {
        type: Number,
        value: 0,
        notify: true,
      },
      cursorEnd: {
        type: Number,
        value: 0,
        notify: true,
      },
    };
  }

  /**
   * Focus
   */
  focus() {
    const textarea = this.shadowRoot.getElementById('sms-textarea');
    textarea.focus();
    this.cursorEnd = textarea.selectionEnd;
    this.cursorStart = textarea.selectionStart;
  }

  /**
   * Set caret position
   *
   * @param {number} start
   * @param {number} end
   */
  setCaretPosition(start, end) {
    if (!start && !end) return;
    const textarea = this.shadowRoot.getElementById('sms-textarea');
    textarea._focusableElement.setSelectionRange(start, end);
  }

  /**
   * Text Observer
   *
   * @param {string} text
   * @private
   */
  _textObserver(text) {
    const baseText = text ? text : '';
    const inputChars = encoderUtils.unicodeCharacters(baseText);

    this.type = encoderUtils.pickencoding(inputChars);

    const baseSegments = this.type === 'gsm'
      ? encoderUtils._segmentWith(160, 153,
        encoderUtils.encodeCharGsm)(inputChars)
      : encoderUtils._segmentWith(140, 134,
        encoderUtils.encodeCharUtf16)(inputChars);

    this.characters = baseSegments.reduce((acc, segment) => {
      const chars = segment.text
        .map((char, i) => {
          const utfChar = encoderUtils.unicodeCodePoints(char)[0];

          return {
            bytes: segment.bytes[i].length,
            charBytes: segment.bytes[i],
            double: (utfChar in unicodeToGsm) && unicodeToGsm[utfChar].length > 1,
            encode: (utfChar in unicodeToGsm) ? 'gsm' : 'ucs2',
            text: char,
          };
        });

      return acc.concat(chars);
    }, []);

    this.segments = baseSegments.length;
    this.invalid = baseSegments.length > this.limitSegments;
  }

  /**
   * Compute char counter
   *
   * @param {Array} chars
   * @return {number}
   * @private
   */
  _computeCharCounter(chars) {
    return chars.map((char) => char.bytes).reduce((a, b) => a + b, 0);
  }

  /**
   * Messages Observer
   *
   * @param {number} segments
   * @param {string} type
   * @param {number} limitSegments
   * @return {number}
   * @private
   */
  _computeLimit(segments, type, limitSegments) {
    if (type === 'gsm') {
      if (segments <= 1) {
        return 160 * limitSegments;
      } else {
        return 153 * limitSegments;
      }
    }
    if (segments <= 1) {
      return 140 * limitSegments;
    } else {
      return 134 * limitSegments;
    }
  }

  /**
   * Return label character
   * @param {object} character
   * @return {string}
   * @private
   */
  _labelCharacter(character) {
    let text = 'unknown';
    if (character.encode === 'gsm') {
      text = character.double ? this.labelGsmDouble : this.labelGsm;
    } else if (character.encode === 'ucs2') {
      text = this.labelUcs2;
    }
    return text;
  }
}

window.customElements.define(SkeletonSmsValidator.is, SkeletonSmsValidator);
