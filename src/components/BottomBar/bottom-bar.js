import './bottom-bar.scss';
import Component from '../../utils/Component.js';

export default Component({
    template: `
    <div class="bottom-bar">
        <div class="bottom-bar-item" style="margin-right: 10px;" @click="createProjectButtonClickEvent">新建项目</div>
        <div class="bottom-bar-item" style="margin-right: 10px;" @click="importFileButtonClickEvent">导入文件</div>
        <div class="bottom-bar-item" @click="exportVideoButtonClickEvent">生成视频</div>
    </div>
    `,
    methods: {
        createProjectButtonClickEvent() {
            console.log('[Bottom Bar] createProjectButtonClickEvent', this);
        },
        importFileButtonClickEvent() {
            console.log('[Bottom Bar] importFileButtonClickEvent', this);
        },
        exportVideoButtonClickEvent() {
            console.log('[Bottom Bar] exportVideoButtonClickEvent', this);
        }
    },
});