
get_errors_string = (err) => {
    var error = "";
    for (var key in err.errors) {
        error += err.errors[key].message + "\n";
    }
    return error;
};

module.exports = {
    get_errors_string
};