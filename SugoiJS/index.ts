import {PostModel} from "./models/post.model";

async function main() {
    await FindModel().then(res => console.log("Amount of results %s", res.length));
    await FindModel(11).then(console.log);
    await SaveModel();
    await UpdateModel(10);
    await RemoveModel(100);
}

async function FindModel(id?: number) {
    return await id
        ? PostModel.findById(11)
        : PostModel.find();
}

async function SaveModel() {
    const model = PostModel.builder().setBody(1);

    await model.save()
        .then(res => console.log("Saved successfully %s", JSON.stringify(res)))
        .catch(err=>err);

    model.setTitle("try");
    await model.save()
        .then(res => console.log("Saved successfully %s", JSON.stringify(res)))
        .catch(err=>err);

    model.setBody("I'm good");
    await model.save()
        .then(res => console.log("Saved successfully %s", JSON.stringify(res)))
        .catch(err=>err);

}

async function UpdateModel(id: number) {
    return await PostModel.updateById(id, {title: "try me"})
        .then(res => console.log("Updated successfully %s", JSON.stringify(res)))
        .catch(console.error);
}

async function RemoveModel(id: number) {
    return await PostModel.removeById(id)
        .then(res => console.log("Removed successfully %s", JSON.stringify(res)))
        .catch(console.error);
}


main().then(() => {
    console.log("Completed");
});