const app = require('./app')

var events = {
    Records: [
        {
            "name": "test1",
            "address": "https://jsonplaceholder.typicode.com/posts/1"
        },
        {
            "name": "test2",
            "address": "https://jsonplaceholder.typicode.com/posts/2"
        }
    ]
}
app.fileProcessorHandler(events, '')