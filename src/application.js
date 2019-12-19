import './application.scss';
import Component from './utils/Component.js';
import Navigation from './components/Navigation/navigation.js';
import Content from './components/Content/content.js';
import BottomBar from './components/BottomBar/bottom-bar.js';

export default Component({
    components: {
        Navigation,
        Content,
        BottomBar,
    },
    template: `
    <div id="app">
        <Navigation></Navigation>
        <Content></Content>
        <BottomBar></BottomBar>
    </div>
    `
    // {
    //     type: 'div',
    //     class: 'content',
    //     children: [{
    //         type: 'div',
    //         class: 'content-header',
    //         children: [{
    //             type: 'text',
    //             content: '最近使用'
    //         }]
    //     }]
    // },
});