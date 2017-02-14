import Ember from 'ember';

export default Ember.Controller.extend({
    onSuccessAnimateIn() {
        //execute some logic here that occurs after the success state is shown
        //such as transitioning to another page
    },

    onErrorAnimateIn() {
        //execute some logic here that occurs after the error state is shown
    },

    actions: {
        clickWithPromise() {
            return new Ember.RSVP.Promise((resolve) => {
                Ember.run.later(this, () => {
                    resolve(Ember.run.bind(this, 'onSuccessAnimateIn'));
                }, 2000);
            });
        },

        clickWithRejectedPromise() {
            return new Ember.RSVP.Promise((resolve, reject) => {
                Ember.run.later(this, () => {
                    reject(Ember.run.bind(this, 'onErrorAnimateIn'));
                }, 2000);
            });
        },

        clickWithoutPromise() {
            return true;
        }
    }
});
