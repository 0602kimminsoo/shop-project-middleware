async function getTodoItemsFromServer() {
    const response = await fetch("http://localhost:3000/todo-items")
    const items = await response.json()
    return items
}

function addItem(item) {
    const c = item.status === "done" ? "danger" : ""
    const html =
        '<li data-id="' +
        item.id +
        '" class="animated flipInX ' +
        c +
        '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><label><span class="checkbox-mask"></span><input type="checkbox" />' +
        item.title +
        "</label></div></li>"

    if (item.title === "") {
        $(".err")
            .removeClass("hidden")
            .addClass("animated bounceIn")
    } else {
        $(".err").addClass("hidden")
        $(".todo-list").append(html)
    }

    $(".refresh").removeClass("hidden")
    $(".no-items").addClass("hidden")

    $(".form-control")
        .val("")
        .attr("placeholder", "✍️ Add item...")
    setTimeout(function () {
        $(".todo-list li").removeClass("animated flipInX")
    }, 500)
}

function refresh() {
    $(".todo-list li").each(function (i) {
        $(this)
            .delay(70 * i)
            .queue(function () {
                $(this).addClass("animated bounceOutLeft")
                $(this).dequeue()
            })
    })

    setTimeout(function () {
        $(".todo-list li").remove()
        $(".no-items").removeClass("hidden")
        $(".err").addClass("hidden")
    }, 800)
}

function setHeaderByDay() {
    const todayContainer = document.querySelector(".today")
    const weekday = [
        "Sunday 🖖",
        "Monday 💪😀",
        "Tuesday 😜",
        "Wednesday 😌☕️",
        "Thursday 🤗",
        "Friday 🍻",
        "Saturday 😴"
    ]

    const n = weekday[new Date().getDay()]
    const randomWordArray = [
        "Oh my, it's ",
        "Whoop, it's ",
        "Happy ",
        "Seems it's ",
        "Awesome, it's ",
        "Have a nice ",
        "Happy fabulous ",
        "Enjoy your "
    ]

    const randomWord =
        randomWordArray[Math.floor(Math.random() * randomWordArray.length)]
    todayContainer.innerHTML = randomWord + n
}

(async () => {
    this.todoItems = await getTodoItemsFromServer()

    function syncTodoItemsWithDisplay(todoItems) {
        $(".todo-list").html("")

        todoItems.forEach(item => {
            addItem(item)
        })
    }

    function syncTodoItems(newOtoItems) {
        this.todoItems = [...newOtoItems]
        return () => {
            syncTodoItemsWithDisplay(this.todoItems)
        }
    }

    function getTodoItemsFrom() {
        return this.todoItems
    }

    function setToDone(id) {
        const todoItems = [...getTodoItemsFrom()]
        const todoItemIndex = todoItems.findIndex(item => item.id === id)
        const todoItem = todoItems[todoItemIndex]
        const newStatus = (todoItem.status === 'new') ? "done" : "new"
        todoItem.status = newStatus
        todoItems.splice(todoItemIndex, 1, todoItem)
        syncTodoItems(todoItems)
    }

    function deleteTodo(id) {
        console.log(id)
        const baseState = getTodoItemsFromServer()
        delete baseState[id]
        syncState(baseState)
    }

    const err = $(".err"),
        formControl = $(".form-control"),
        isError = formControl.hasClass("hidden")

    if (!isError) {
        formControl.blur(function () {
            err.addClass("hidden")
        })
    }

    $(".add-btn").on("click", function () {
        const itemVal = $(".form-control").val()
        addItem(itemVal)
        formControl.focus()
    })

    $(".refresh").on("click", refresh)

    $(".todo-list").on("click", 'input[type="checkbox"]', function () {
        const li = $(this)
            .parent()
            .parent()
            .parent()
        li.toggleClass("danger")
        li.toggleClass("animated flipInX")

        setToDone(li.data().id)

        setTimeout(function () {
            li.removeClass("animated flipInX")
        }, 500)
    })

    $(".todo-list").on("click", ".close", function () {
        const box = $(this)
            .parent()
            .parent()

        if ($(".todo-list li").length == 1) {
            box.removeClass("animated flipInX").addClass("animated                bounceOutLeft")
            setTimeout(function () {
                box.remove()
                $(".no-items").removeClass("hidden")
                $(".refresh").addClass("hidden")
            }, 500)
        } else {
            box.removeClass("animated flipInX").addClass("animated bounceOutLeft")
            setTimeout(function () {
                box.remove()
            }, 500)
        }

        deleteTodo(box.data().id)
    })

    $(".form-control").keypress(function (e) {
        if (e.which == 13) {
            const itemVal = $(".form-control").val()
            addItem(itemVal)
        }
    })
    $(".todo-list").sortable()
    $(".todo-list").disableSelection()


    setHeaderByDay()
    syncTodoItems(todoItems)()
})()

