import Vuex from 'vuex';
import mount from './setup';
import BaseDialog from '@/components/common/BaseDialog.vue';

describe('BaseDialog.vue', () => {
    let getters;
    let store;
    beforeEach(() => {
        getters = {
            darkTheme: () => true,
        };
        store = new Vuex.Store({
            getters,
        });
    });
    it('Snapshot render', () => {
        let wrapper = mount({
            shallow: false,
            component: BaseDialog,
            store: store,
            props: {
                value: true, // set Modal to be open
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });
    it('closes when buttons are pressed', () => {
        let wrapper = mount({
            shallow: false,
            component: BaseDialog,
            store: store,
            props: {
                value: true, // set Modal to be open
            },
        });
        const closeButton = wrapper.find('.close');
        const cancelButton = wrapper.find('.cancel');
        let eventFired = 0;

        wrapper.vm.$on('cancelClick', () => {
            eventFired++;
        });

        closeButton.trigger('click');
        cancelButton.trigger('click');
        expect(eventFired).toEqual(2);
    });
});
