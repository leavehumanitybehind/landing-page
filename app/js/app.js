const input = document.querySelector(".footer-input");
const form = document.querySelector(".footer-form");
const btn = document.querySelector(".footer-btn");
const errorMsg = document.querySelector(".error-msg");

const removeNotificationStyle = (inputClass, msgClass) => {
    input.classList.remove(inputClass)
    errorMsg.classList.remove(msgClass)
}

const createNotificationStyle = (inputClass, msgClass, msg) => {
    input.classList.add(inputClass)
    errorMsg.classList.add(msgClass);
    errorMsg.innerText = msg;
    form.offsetWidth = form.offsetWidth;
    form.classList.add("modal-error");
    setTimeout(function () {
        removeNotificationStyle(inputClass, msgClass)
    }, 2000)
}

const isValidMail = (myMail) => {
    return /^((([0-9A-Za-z]{1}[-0-9A-z\.]{0,30}[0-9A-Za-z]?)|([0-9А-Яа-я]{1}[-0-9А-я\.]{0,30}[0-9А-Яа-я]?))@([-A-Za-z]{1,}\.){1,}[-A-Za-z]{2,})$/.test(myMail);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!input.value) {
        createNotificationStyle("footer-input--error", "Error", "This field is necessary");
    } else {
        isValidMail(input.value) ? createNotificationStyle("footer-input--active", "success", "Your application has been sent") : createNotificationStyle("footer-input--error", "Error", "Oops! That doesn’t look like an email address");
    }
    input.value = ''
})

