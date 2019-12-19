import './content.scss';
import Component from '../../utils/Component.js';
import ContentItem from '../ContentItem/content-item.js';

export default Component({
    components: {
        ContentItem,
    },
    template: `
    <div class="content">
        <div class="content-header" @click="test">{{isShow ? '123' : '最近使用' }}</div>
        <div class="content-list">
            <ContentItem i-for="(index, item) in list" :item="item" @click="listItemClickEvent"></ContentItem>
        </div>
    </div>
    `,
    data: {
        isShow: false,
        list: [1, 2, 3],
    },
    methods: {
        init() {
            console.log('[Content] init', this);
        },

        moveToSuper() {
            console.log('[Content] moveToSuper', this);
        },

        test(event) {
            console.log('[Content] test', this, event);
        },

        listItemClickEvent(event) {
            console.log('[Content] listItemClickEvent', this, event);
        }
    }
});