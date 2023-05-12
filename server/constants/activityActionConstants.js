const taskActivityAction = {
    CREATED: "oluşturuldu",
    UPDATED: "güncellendi",
    STATUS_CHANGED: "durumu değişti",
    PRIORITY_CHANGED: "önceliği değişti",
    TYPE_CHANGED: "tipi değişti",
    COMMENT_ADDED: "yorum eklendi",
    REMINDER_SET: "hatırlatma yapıldı"
};

getTaskActivityActions = () => {
    return Object.keys(taskActivityAction).map(key => taskActivityAction[key]);
};

module.exports = {
    taskActivityAction,
    getTaskActivityActions
};