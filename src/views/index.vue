<template>
    <div id="mainContent">
        <header>
            <h1>todos</h1>
            <input v-model="tagVal" @keyup.enter="onSubmit" autofocus="autofocus" autocomplete="off"
                   placeholder="What needs to be done?" class="new-todo">
            <!--全选-->
            <div class="toggle-all"></div>
        </header>
        <div class="main">
            <ul class="todo-list">
                <li class="todo" v-for="item in tagsArray" :key="item.id">
                    <div class="view">
                        <div class="roundSelection" @click="selectedFun(item.id)">
                            <i class="iconfont icon-duihao" v-if="item.stats===true"></i>
                        </div>
                        <span class="title" v-if="item.stats===false">{{item.title}}</span>
                        <span class="title strikethrough" v-else>{{item.title}}</span>
                        <div class="destroy" @click="deleteToDoFun(item.id,false)">
                            <i class="iconfont icon-cuohao"></i>
                        </div>
                        <input type="text" class="edit" style="display: none">
                    </div>
                </li>
            </ul>
            <div class="footer" v-if="tagsArray.length>0||JSON.parse(storage.getItem('tagsArray')).length>0">
                <!--条目数量-->
                <span><span>{{(tagsArray.length)}}</span>items left</span>
                <!--按钮切换 this.$route.query.links==='frontEnd'?'selected':'' -->
                <ul class="button-switch">
                    <li :class="this.$route.query.currentToDoOption==='all'?'selected':''"
                        @click="filterToDoItems('all')">
                        <span>All</span>
                    </li>
                    <li @click="filterToDoItems('active')"
                        :class="this.$route.query.currentToDoOption==='active'?'selected':''">
                        <span>Active</span>
                    </li>
                    <li @click="filterToDoItems('completed')"
                        :class="this.$route.query.currentToDoOption==='completed'?'selected':''">
                        <span>Completed</span>
                    </li>
                </ul>
                <div class="clear-completed" v-if="optional.length>0">
                    <span @click="deleteToDoFun(0,true)">clear-completed</span>
                </div>
            </div>
        </div>
        <footer class="info">
            <p>Double-click to edit a todo</p>
            <p>Written by <a href="http://evanyou.me">Evan You</a></p>
            <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                tagsArray: [],
                tagVal: '',
                optional: [],
                currentToDoOption: "all",
                storage: window.localStorage
            }
        },
        mounted: function () {
            //赋值默认路由参数
            if (!this.$route.query.currentToDoOption) {
                this.$router.push({name: 'index', 'query': {currentToDoOption: 'all'}})
            }
            let storage = window.localStorage;
            if (storage.getItem("tagsArray")) {
                this.tagsArray = JSON.parse(storage.getItem("tagsArray"));
            }
            //根据路由渲染事项内容
            switch (this.$route.query.currentToDoOption) {
                case "all":
                    this.tagsArray = JSON.parse(storage.getItem("tagsArray"));
                    break;
                case "active":
                    this.tagsArray.length = 0;
                    //从本地缓存中取出stats为false的数据
                    for (let item of JSON.parse(storage.getItem("tagsArray"))) {
                        if (!item.stats) {
                            this.tagsArray.push(item);
                        }
                    }
                    break;
                case "completed":
                    this.tagsArray.length = 0;
                    //从本地缓存中取出stats为true的数据
                    for (let item of JSON.parse(storage.getItem("tagsArray"))) {
                        if (item.stats) {
                            this.tagsArray.push(item);
                        }
                    }
                    break;
            }
        },
        methods: {
            //添加待办项
            onSubmit: function () {
                let id = 1;
                if (!(this.tagVal).trim()) {
                    return;
                }
                //使用本地存储
                let storage = window.localStorage;
                if (storage.getItem("tagsArray")) {
                    if (JSON.parse(storage.getItem("tagsArray")).length > 0) {
                        id = (JSON.parse(storage.getItem("tagsArray")).length) + 1
                    }
                }
                let tagsObj = {
                    "id": id,
                    "title": this.tagVal,
                    "stats": false
                };

                let tagsArrayData = storage.getItem("tagsArray");
                if (tagsArrayData) {
                    let tagsArray = JSON.parse(tagsArrayData);
                    tagsArray.push(tagsObj);
                    storage.setItem("tagsArray", JSON.stringify(tagsArray));
                } else {
                    let tagsArray = [];
                    tagsArray.push(tagsObj);
                    storage.setItem("tagsArray", JSON.stringify(tagsArray));
                }
                this.tagsArray = JSON.parse(storage.getItem("tagsArray"));
                this.tagVal = "";
            },
            // 选择待办项
            selectedFun: function (id) {
                let storage = window.localStorage;
                for (let item of this.tagsArray) {
                    //根据id查找当前点击项的状态
                    if (item.id === id) {
                        item.stats ? item.stats = false : item.stats = true;
                        let tagsArrayData = JSON.parse(storage.getItem("tagsArray"));
                        if (item.stats) {
                            //存放已选择的元素
                            this.optional.push(id);
                            //修改本地存储中元素状态
                            for (item of tagsArrayData) {
                                item.id === id ? item.stats = true : '';
                                storage.setItem("tagsArray", JSON.stringify(tagsArrayData));
                            }
                        } else {
                            //快速删除数组中的元素
                            this.optional.splice(this.optional.findIndex(v => v === id), 1);
                            //修改本地存储中元素状态
                            for (item of tagsArrayData) {
                                item.id === id ? item.stats = false : '';
                                storage.setItem("tagsArray", JSON.stringify(tagsArrayData));
                            }
                        }
                        break;
                    }
                }
            },
            // 删除待办项函数
            deleteToDoFun: function (id, stats) {
                let storage = window.localStorage;
                let tagsArrayData = JSON.parse(storage.getItem("tagsArray"));
                if (stats) {
                    //删除多个元素
                    for (let item of this.optional) {
                        this.tagsArray.splice(this.tagsArray.findIndex(v => v.id === item), 1);
                        tagsArrayData.splice(tagsArrayData.findIndex(v => v.id === item), 1);
                    }
                    //更新本地缓存
                    storage.setItem("tagsArray", JSON.stringify(tagsArrayData));
                    //清空已选择的代办
                    this.optional.length = 0;
                } else {
                    //删除单个元素
                    this.tagsArray.splice(this.tagsArray.findIndex(v => v.id === id), 1);
                    tagsArrayData.splice(tagsArrayData.findIndex(v => v.id === id), 1);
                    //更新本地缓存
                    storage.setItem("tagsArray", JSON.stringify(tagsArrayData));
                }
            },
            //筛选待办项
            filterToDoItems: function (filter) {
                let storage = window.localStorage;
                switch (filter) {
                    case "all":
                        this.$router.push({
                            path: '/',
                            query: {
                                currentToDoOption: "all"
                            }
                        });
                        this.tagsArray = JSON.parse(storage.getItem("tagsArray"));
                        break;
                    case "active":
                        this.$router.push({
                            path: '/',
                            query: {
                                currentToDoOption: "active"
                            }
                        });
                        this.tagsArray.length = 0;
                        //从本地缓存中取出stats为false的数据
                        for (let item of JSON.parse(storage.getItem("tagsArray"))) {
                            if (!item.stats) {
                                this.tagsArray.push(item);
                            }
                        }
                        break;
                    case "completed":
                        this.$router.push({
                            path: '/',
                            query: {
                                currentToDoOption: "completed"
                            }
                        });
                        this.tagsArray.length = 0;
                        //从本地缓存中取出stats为true的数据
                        for (let item of JSON.parse(storage.getItem("tagsArray"))) {
                            if (item.stats) {
                                this.tagsArray.push(item);
                            }
                        }
                        break;
                }
            }
        }
    }
</script>

<style scoped lang="scss" src="@/assets/scss/index.scss">

</style>
