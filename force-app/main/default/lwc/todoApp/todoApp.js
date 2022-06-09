import {
    LightningElement,
    track,
    wire
} from 'lwc';
import getTasks from '@salesforce/apex/TodoList.getTasks';
import {
    refreshApex
} from '@salesforce/apex';
import insertTask from '@salesforce/apex/TodoList.insertTask';
import deleteTask from '@salesforce/apex/TodoList.deleteTask';





export default class TodoApp extends LightningElement {


    @track
    todoTasks = [];

    todoTasksResponse;

    newTask = '';
    updateNewTask(event) {
        this.newTask = event.target.value;
    }

    addTaskToList(event) {
        // if (this.newTask !== '') {
        //     this.todoTasks.push({
        //         id: this.todoTasks.length + 1,
        //         name: this.newTask + this.id
        //     });
        //     this.newTask = '';

        // } else {
        //     alert('Please Enter Text');
        // }

        insertTask({
                subject: this.newTask
            })
            .then(result => {
                console.log(result);

                this.todoTasks.push({
                    id: this.todoTasks.length + 1,
                    name: this.newTask,
                    recordId: result.Id
                });




                this.newTask = '';
            })
            .catch(error => console.log(error));



    }

    removeTask(event) {
        let idToDelete = event.target.name;
        let todoTasks = this.todoTasks;
        let todoTaskIndex;
        let recordIdToDelete;
        for (let i = 0; i < todoTasks.length; i++) {
            if (idToDelete === todoTasks[i].id) {
                todoTaskIndex = i;
            }
        }

        recordIdToDelete = todoTasks[todoTaskIndex].recordId;
        console.log(recordIdToDelete)

        deleteTask({
                recordId: recordIdToDelete
            })
            .then(result => {
                console.log(result);
                if (result) {
                    this.todoTasks.splice(todoTaskIndex, 1);
                } else {
                    console.log('Unable to delete task')
                }

            })
            .catch(error => console.log(error));


    }

    @wire(getTasks)
    getTodoTasks(response) {
        this.todoTasksResponse = response;
        let data = response.data;
        let error = response.error;
        if (data) {
            console.log(data);
            this.todoTasks = [];
            data.forEach(task => {
                this.todoTasks.push({
                    id: this.todoTasks.length + 1,
                    name: task.Subject,
                    recordId: task.Id
                });
            })
        } else if (error) {
            console.log(error);
        }



    }

    refreshTodoList() {
        refreshApex(this.todoTasksResponse);
    }

}