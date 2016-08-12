const Yelp = require('yelp');
const Bar = require('../models/Bar');

var yelp = new Yelp({
  consumer_key:     NONE,
  consumer_secret:  OF,
  token:            YOUR,
  token_secret:     BUSINESS,
});

exports.getBars = (req,res) => {
    yelp.search({ category_filter: 'bars', location: req.params.loc, limit: 10 })
        .then(function (data) {
            var bars = []; 
            data.businesses.forEach(function (item, index){
                var imgoing = false;
                var going;
                Bar.findOrCreate({name:item.name},(err,bar,created) => {
                    if(err) throw err;
                    going = bar.going.length;
                    if(req.user) {
                        imgoing = (bar.going.indexOf(req.user.uid) > -1);
                    }
                    bars.push({
                        name: item.name,
                        desc: item.snippet_text,
                        img: item.image_url,
                        going: going,
                        imgoing: imgoing
                    });
                    if(index == 9){
                        console.log(bars);
                    res.render('bars/bars', {
                        title: 'Bars arround ' + req.params.loc,
                        loc: req.params.loc,
                        bars: bars
                    });
                    }
                });
            });
        })
        .catch(function (err) {
            console.error(err);
        });
};

exports.going = (req,res) => {
    Bar.findOne({name:req.params.name},(err, bar) => {
        if(err) throw err; 
        if (bar.going.indexOf(req.user.uid) > -1) {
           Bar.update({name:req.params.name},
            {$pull: {going: req.user.uid}}, 
            {upsert: true}, 
            (err) => {
                if(err) throw err;
            res.redirect("/bars/"+req.params.loc); 
            });
        }
        else {
            Bar.update({name:req.params.name},
            {$push: {going: req.user.uid}}, 
            {upsert: true}, 
            (err) => {
                if(err) throw err;
            res.redirect("/bars/"+req.params.loc); 
            });
        }
    });
    
};