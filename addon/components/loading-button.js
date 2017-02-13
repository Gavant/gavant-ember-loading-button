import Ember from 'ember';
import layout from '../templates/components/loading-button';

const {
    get,
    set,
    computed,
    computed: { or },
    getWithDefault,
    canInvoke,
    Component,
    String: { capitalize },
    RSVP: { Promise },
    run: {
        later,
        cancel
    }
} = Ember;

let positionalParamsMixin = {
  positionalParams: 'params'
};

export default Component.extend(positionalParamsMixin, {
    layout: layout,
    targetObject: or('parentView.controller', 'parentView'),
    tagName: 'button',
    classNames: ['spinner-button', 'btn'],
    classNameBindings: ['isSpinning', 'successShown', 'errorShown'],
    attributeBindings: ['disabled', 'title'],
    loadingClass: 'loading',
    isSpinning: false,
    showSuccess: true,
    showError: true,
    successShown: false,
    errorShown: false,
    successStateDuration: 3000,
    successAnimateInDuration: 1000,
    errorStateDuration: 1000,
    errorAnimateInDuration: 1000,
    successIcon: 'fa fa-check-circle',

    style: computed('width', 'isSpinning', 'successShown', 'errorShown', function() {
        //only set a hard width when the spinner or result states are shown so that the button naturally determines
        //its width based on its content/container width when in the non spinning state
        //this is mainly is for block-level buttons (.btn-block), whose width can dynamically change in RWD situations
        const width = get(this, 'width');
        const style = get(this, 'isSpinning') || get(this, 'successShown') || get(this, 'errorShown') ? `width:${width}px;` : "";

        return Ember.String.htmlSafe(style);
    }),

    showResultState(type, animateInCallback) {
        if(!this.isDestroyed && get(this, `show${capitalize(type)}`)) {
            set(this, `${type}Shown`, true);

            const showResultTimer = later(this, () => {
                if(!this.isDestroyed) {
                    set(this, `${type}Shown`, false);
                }
            }, get(this, `${type}StateDuration`));

            set(this, 'showResultTimer', showResultTimer);

            //send an action when a result state finishes animating in
            //e.g. so the parent controller can transition once the success state is shown
            if(typeof animateInCallback === 'function') {
                later(this, animateInCallback, get(this, `${type}AnimateInDuration`));
            }

            // if(canInvoke(this.attrs, `on${capitalize(type)}AnimateIn`)) {
            //     later(this.attrs, `on${capitalize(type)}AnimateIn`, get(this, `${type}AnimateInDuration`));
            // }
        }
    },

    click(event) {
        event.preventDefault();
        let isSpinning = get(this, 'isSpinning');
        if (!isSpinning) {
            this.setProperties({
                width: this.$('.fixed-width').width(),
                isSpinning: true,
                successShown: false,
                errorShown: false
            });

            cancel(this.get('showResultTimer'));

            const params = getWithDefault(this, 'params', []);
            //coerce the returned value into an RSVP promise object to ensure it has a .finally() method
            const resolvedPromise = Ember.RSVP.resolve(this.attrs.clicked(params));

            resolvedPromise.then((callback) => {
                this.showResultState('success', callback);
            });

            resolvedPromise.catch((callback) => {
                this.showResultState('error', callback);
            });

            resolvedPromise.finally(() => {
                if (!this.isDestroyed) {
                    set(this, 'isSpinning', false);
                }
            });
        }
    }
});
