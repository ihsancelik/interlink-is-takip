const taskActivityAction = {
    CREATED: "oluşturuldu",
    UPDATED: "güncellendi",
    DELETED: "silindi",
    STATUS_CHANGED: "durumu değişti",
    PRIORITY_CHANGED: "önceliği değişti",
    PROJECT_CHANGED: "projesi değişti",
    TYPE_CHANGED: "tipi değişti",
    COMMENT_ADDED: "yorum eklendi",
    REMINDER_SENT: "hatırlatma yapıldı",
    RELATED_PERSON_CHANGED: "görevlisi değişti"
};

getTaskActivityActions = () => {
    return Object.keys(taskActivityAction).map(key => taskActivityAction[key]);
};

module.exports = {
    taskActivityAction,
    getTaskActivityActions
};