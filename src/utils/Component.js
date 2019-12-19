function Component(options) {

    function dealTemplete(templateSource) {
        if (templateSource && Object.prototype.toString.call(templateSource) === '[object Object]') {
            let template = {};
            if (typeof(templateSource.type) === 'string') {
                if (templateSource.type === 'text') {
                    template.dom = document.createTextNode(templateSource.content);
                } else {
                    template.dom = document.createElement(templateSource.type.split(/\s+/)[0]); // $('<' + templateSource.type + '>')
                }
            } else {
                template.dom = templateSource.type(templateSource.init);
            }

            if (templateSource.class) {
                if (typeof(templateSource.class) === 'string') {
                    template.class = templateSource.class.split(/\s+/);
                } else if (Object.prototype.toString.call(templateSource.class) === '[object Array]') {
                    template.class = templateSource.class;
                }

                if (template.class) {
                    template.dom.setAttribute('class', template.class.join(' '));
                    // template.dom.addClass(template.class.join(' '));
                }
            }

            if (templateSource.children) {
                template.children = [];
                for (let subtemplate of templateSource.children) {
                    let subtemplateitem = dealTemplete(subtemplate);
                    if (subtemplateitem) {
                        template.children.push(subtemplateitem);
                        template.dom.appendChild(subtemplateitem.dom); // .append(subtemplateitem.dom);
                    }
                }
            }

            return template;
        }

        return null;
    }

    function dealHtmlNodes(node) {
        console.log('note', node, node.nodeName, node.nodeType, node.tagName, Template);

        let element = {
            dom: node,
            children: undefined,
            data: undefined,
            instructions: undefined,
            event: undefined,
        };

        let tempAttributes = node.attributes;
        console.log('attributes', tempAttributes);
        if (tempAttributes) {
            for (let attributeItem of tempAttributes) {
                console.log('attributeItem', attributeItem, attributeItem.nodeName, attributeItem.value);
                if (attributeItem.nodeName.search(/^i\-/) >= 0) {
                    console.log('指令');
                    if (!element.instructions) {
                        element.instructions = {};
                    }

                    let instructionName = attributeItem.nodeName.substring(2);
                    element.instructions[instructionName] = attributeItem.value;
                } else if (attributeItem.nodeName.search(/^\:/) >= 0) {
                    console.log('绑定');
                    if (!element.data) {
                        element.data = {};
                    }

                    element.data[attributeItem.nodeName.substring(1)] = attributeItem.value;
                } else if (attributeItem.nodeName.search(/^\@/) >= 0) {
                    console.log('事件');
                    if (!element.event) {
                        element.event = {};
                    }

                    element.event[attributeItem.nodeName.substring(1)] = {
                        params: undefined,
                        callbackName: attributeItem.value,
                        callback: function(callbackName, event) {
                            console.log('element event callback', this, callbackName, event);
                            if (this.params) {
                                let tempParamsList = [];
                                for (let paramItem of this.params) {
                                    if (paramItem === '$event') {
                                        tempParamsList.push(event);
                                    } else {

                                    }
                                }

                                Template.that[callbackName](...tempParamsList);
                            } else {
                                Template.that[callbackName](event);
                            }
                        }
                    };
                }
            }
        }

        if (node.tagName) {
            element.type = 'dom';
            if (options.componentsNameUpperCaseList) {
                let componentIndex = options.componentsNameUpperCaseList.indexOf(node.nodeName);
                if (componentIndex >= 0) {
                    element.type = 'component';
                    console.log('自定义元素');
                    let tempClass = Template.components[options.componentsNameList[componentIndex]];
                    let tempCustomItem = new tempClass();
                    console.log('tempCustomItem', tempCustomItem);
                    if (tempCustomItem.init) {
                        tempCustomItem.init();
                    }
                    
                    element.component = tempCustomItem;
                    element.dom = tempCustomItem.root();
                    node.parentNode.replaceChild(tempCustomItem.root(), node);
                    if (tempCustomItem.moveToSuper) {
                        tempCustomItem.moveToSuper();
                    }
                }
            }

            if (element.type === 'dom') {
                if (element.data) {

                }

                if (element.event) {
                    for (let eventKey in element.event) {
                        let callbackFullName = element.event[eventKey].callbackName;
                        let [ callbackName, callbackParamsFullString ] = callbackFullName.split('(');
                        if (callbackParamsFullString) {
                            let callbackParamsString = callbackParamsFullString.split(')')[0];
                            if (callbackParamsString && callbackParamsString.length > 0) {
                                let callbackParams = callbackParamsString.split(/\,S*/g);
                                element.event[eventKey].params = callbackParams;
                            }
                        }

                        node.addEventListener(eventKey, function(event) {element.event[eventKey].callback.apply(element, [callbackName, event])}, false);
                    }
                }
            } else {
                if (element.data) {

                }

                if (element.event) {

                }
            }
        } else if (node.nodeName === '#text') {
            element.type = 'text';
            console.log('text', node.nodeValue);
            let tempList_0 = node.nodeValue.match(/\{\{.*\}\}/);
            console.log('text_0', tempList_0);
            
            if (tempList_0 && tempList_0.length > 0) {
                let tempList_1 = [];
                for (let tempList_0_item of tempList_0) {
                    tempList_1.push(tempList_0_item.substring(2, tempList_0_item.length - 2));
                }
                console.log('text_1', tempList_1);

                let tempList_2 = node.nodeValue.split(/\{\{.*\}\}/);
                console.log('text_2', tempList_2);

                let tempList_3 = [];
                let tempList_3_string = "";
                for (let i = 0; i < tempList_2.length; i++) {
                    tempList_3.push({
                        type: 'text',
                        content: tempList_2[i],
                    });

                    tempList_3_string += tempList_2[i];

                    if (tempList_1[i]) {
                        tempList_3.push({
                            type: 'expression',
                            content: tempList_1[i],
                        });

                        tempList_3_string += Template.that.runExpression(tempList_1[i]);
                    }
                }

                console.log('text_3', tempList_3);
                node.nodeValue = tempList_3_string;
            }
        }

        
        

        if (node.childNodes && node.childNodes.length) {
            element.children = [];
            for (let childNode of node.childNodes) {
                element.children.push(dealHtmlNodes(childNode));
            }
        }

        return element;
    }

    let Template = {
        that: undefined,
        dom: undefined, // 根元素
        children: undefined, // 子元素
        components: undefined, // 引用的组件
        methods: undefined,
    };


    let ComponentClass = function () {
        Template.that = this;

        if (options.template) {
            this.runExpression = function(expression) {
                let tempList = Object.keys(Template.data);

                let tempString = "";
                for (let tempKey of tempList) {
                    tempString += ('var ' + tempKey + ' = this.' + tempKey + ';');
                }

                tempString += ("eval(expression);");
                let result = eval(tempString);
                return result;
            };
            
            this.root = function () {
                return Template.dom;
            }
    
            this.setData = function (params) {
    
            }

            Template.components = options.components;
            if (options.components) {
                let componentsNameUpperCaseList = [];
                let componentsNameList = [];
                for (let componentItemName in options.components) {
                    componentsNameList.push(componentItemName);
                    componentsNameUpperCaseList.push(componentItemName.toUpperCase());
                }
                if (componentsNameList.length > 0) {
                    options.componentsNameList = componentsNameList;
                    options.componentsNameUpperCaseList = componentsNameUpperCaseList;
                }
            }

            if (options.data) {
                Template.data = options.data;
                for (let dataKey in options.data) {
                    this[dataKey] = options.data[dataKey];
                }
            }
            
            if (options.methods) {
                for (let methodKey in options.methods) {
                    let method = options.methods[methodKey];
                    this[methodKey] = method.bind(this);
                }
            }

            if (typeof(options.template) === 'string') {
                let parser = new DOMParser();
                let tempHtmlString = options.template.replace(/^\s+|\s+$/g,"").replace(/\>(\s+|\n+|\r+)\</g,"><");
                console.log('tempHtmlString', tempHtmlString);
                let htmlDoc = parser.parseFromString(tempHtmlString, "text/html");
                console.log(htmlDoc.body.childNodes[0]);
                Template.dom = htmlDoc.body.children[0];
                let element = dealHtmlNodes(Template.dom);
                console.log('Element', element);
            } else if (Object.prototype.toString.call(options.template) === '[object Object]') {
                // Template.dom = document.createElement(options.template.type.split(/\s+/)[0]); // $('<' + options.template.type.split(/\s+/)[0] + '>');
    
                // if (options.template.class) {
                //     if (typeof(options.template.class) === 'string') {
                //         Template.class = options.template.class.split(/\s+/);
                //     } else if (Object.prototype.toString.call(options.template.class) === '[object Array]') {
                //         Template.class = options.template.class;
                //     }
    
                //     if (Template.class) {
                //         Template.dom.setAttribute('class', Template.class.join(' '));
                //     }
                // }
    
                // if (options.template.children) {
                //     Template.children = [];
                //     for (let subtemplate of options.template.children) {
                //         let subtemplateitem = dealTemplete(subtemplate);
                //         if (subtemplateitem) {
                //             Template.children.push(subtemplateitem);
                //             Template.dom.appendChild(subtemplateitem.dom);
                //         }
                //     }
                // }
            }

            
        }
    };

    return ComponentClass;
}

export default Component;