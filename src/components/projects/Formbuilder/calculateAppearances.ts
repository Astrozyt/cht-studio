const listAppearances = (type: QuestionTypes) => {
    const possibilities: AppearanceNames[] = [AppearanceNames.label, AppearanceNames.list, AppearanceNames.listNolabel];
    if (type === QuestionTypes.select_one_from_file_file_extension) {
        possibilities.push(AppearanceNames.map);
    }
    if (type === QuestionTypes.begin_group || type === QuestionTypes.begin_repeat) {
        possibilities.push(AppearanceNames.fieldList);
    }
    if (type === QuestionTypes.begin_group) {
        possibilities.push(AppearanceNames.tableList);
    }
    if (type === QuestionTypes.barcode) {
        possibilities.push(AppearanceNames.hiddenAnswer);
    }
    if (type === QuestionTypes.text) {
        possibilities.push(AppearanceNames.masked, AppearanceNames.printer);
    }
    if (type === QuestionTypes.integer) {
        possibilities.push(AppearanceNames.counter);
    }
    return possibilities;
}

enum AppearanceNames {
    map = "map",
    fieldList = "field-list",
    label = "label",
    listNolabel = "list-nolabel",
    list = "list",
    tableList = "table-list",
    hiddenAnswer = "hidden-answer",
    printer = "printer",
    masked = "masked",
    counter = "counter"
}