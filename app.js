const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname+"/date.js");
const mongoose = require('mongoose');
const e = require('express');
const _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
let Tasks = [];
let newList = [];
mongoose.connect("mongodb+srv://admin-parshu:Test123@cluster0.dbr2pzl.mongodb.net/todoDB", { useNewUrlParser: true });

const ItemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", ItemSchema);

const ListSchema = new mongoose.Schema({
    name: String,
    item: [ItemSchema]
});

const List = mongoose.model("List", ListSchema);
const item1 = new Item({
    name: "Sleep for 8 hours"
})
const item2 = new Item({
    name: "Drink 10L water regularly"
})
const item3 = new Item({
    name: "No Junk Food"
})
const defaultList = [item1, item2, item3];

// Item.insertMany([item1,item2,item3],function(err){
//     if(err){
//         console.log("Error in inserting items into DB");
//     }
//     else{
//         console.log("Successfully Inserted Items");
//     }
// })

// Item.find(function(err, items) {
//     if(err) {
//         console.log("Error occured in finding data");
//     }
//     else{
//         items.forEach(function(task){
//             Tasks.push(task.name);
//         })
//     }
// })

app.get("/", function (req, res) {

    Item.find(function (err, items) {
        if (items.length == 0) {
            Item.insertMany(defaultList, function (err) {
                if (err) {
                    console.log("Error in inserting items into DB");
                }
                else {
                    console.log("Successfully Inserted Items");
                }
            });
            res.redirect("/");
        }
        else {
            res.render('index', { kindOfDate: "Today", item: items });
        }
        if (err) {
            console.log("Error occured in finding data");
        }
        else {
            console.log("successfully found data from DB");
        }
    });
    // let day = date.getDate();

});
app.get("/:route", function (req, res) {
    const Route = _.capitalize(req.params.route);
    // console.log(Route);
    List.findOne({ name: Route }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: Route,
                    item: defaultList
                });
                list.save();
                res.redirect("/" + Route);
            }
            else {
                res.render('index', { kindOfDate: foundList.name, item: foundList.item });
            }
        }
        else {
            console.log("Error in routing");
        }
    })

})

app.get("/about", function (req, res) {
    res.render('about');
});
app.post("/delete", function (req, res) {
    const deleteId = req.body.checkBox;
    const currList = req.body.currList;
    if (currList === "Today") {
        Item.findByIdAndRemove(deleteId, function (err) {
            if (err) {
                console.log("Error Occured while deleting");
            }
            else {
                res.redirect("/");
                console.log("Successfully Deleted Task");
            }
        })
    }
    else{
        List.findOneAndUpdate({name:currList},
            {$pull:{item:{_id:deleteId}}},
            function(err){
                if(!err){
                    res.redirect("/"+currList);
                }
            })
    }
})
app.post("/", function (req, res) {
    let task = req.body.task;
    let which = req.body.button;
    const I = new Item({
        name: task
    });
    if (which === "Today") {
        I.save();
        res.redirect("/");
    }
    else {
        // Tasks.push(task);
        // Item.insertOne({
        //     name : task
        // })
        List.findOne({ name: which }, function (err, foundList) {
            if (!err) {
                foundList.item.push(I);
                foundList.save();
                res.redirect("/" + which);
            }
            else {
                console.log("Error while inserting in different lists");
            }
        });
    }
})
app.listen(3000, function () {
    console.log("Server is started at port 3000");
})