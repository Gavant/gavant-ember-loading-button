import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        clickWithPromise() {
            return new Ember.RSVP.Promise((resolve) => {
                Ember.run.later(this, () => {
                    resolve(Ember.run.bind(this, this.nonAnonFunc));
                }, 1000);
            });
        },

        clickWithRejectedPromise() {
            return new Ember.RSVP.Promise((resolve, reject) => {
                Ember.run.later(this, () => {
                    reject(function() {
                        console.log('error animated in!');
                    });
                }, 1000);
            });
        },

        clickWithoutPromise() {
            return true;
        },

        nonAnonFunc(foo) {
            console.log('some func on the controller!', foo);
        }
    }
});
