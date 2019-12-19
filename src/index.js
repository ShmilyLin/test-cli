import App from './application';

$(() => {
    console.log('Ready');
    
    let app = new App();
    if (app.init) {
        app.init();
    }

    document.body.appendChild(app.root());

    if (app.moveToSuper) {
        app.moveToSuper();
    }


    // App.dom.append(navigation.template.dom, content.template.dom);


    // let parser = new DOMParser();
    // let htmlDoc = parser.parseFromString('<div class="123" id="asd" style="background-color: red;" @click="fede"></div><template></template>', "text/html");
    // console.log(htmlDoc.body.children);
});