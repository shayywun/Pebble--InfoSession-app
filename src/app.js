var UI= require('ui');
var Accel=require('ui/accel');
var ajax= require('ajax');
var vibe = require('ui/vibe');

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var employer = data[i].employer;

    // Get date/time substring
    var day = data[i].date;
    var time = data[i].start_time;
    time = day + ' ' + time;
    console.log(time);

    // Add to menu items array
    items.push({
      title:employer,
      subtitle:time
    });
  }
  return items;
};

var main = new UI.Card({
  title:'Employer Info Sessions',
  icon:'images/information.png',
  subtitle:"Press Select to Enter",
  
});

main.show();

ajax(
{
  url:'https://api.uwaterloo.ca/v2/resources/infosessions.json?key=45a74e69a87e7f2dd15e3353987a9fa5',
  type: 'GET',
  dataType:'JSON'
},
  function(rawdata){
    var data = JSON.parse(rawdata).data;
    
    var menuItems = parseFeed(data, data.length);
     main.on('click','select', function(e){
       
      var resultsMenu = new UI.Menu({
        sections:[{
          title: 'Info Sessions',
          items: menuItems
        }]
      });
       
    resultsMenu.on('select',function(e){
      console.log("ASagdsgd");
      console.log(e);
      console.log(e.itemIndex);
      var session = data[e.itemIndex];
      var content = data[e.itemIndex].description;
      content = content.charAt(0).toUpperCase() + content.substring(1);
      content +='\nLocation: ' + session.location + '\nAudience: ' + session.audience +'\nPrograms: ' + session.programs;
      var detailCard = new UI.Card({
        title: 'Details',
        subtitle: e.item.subtitle,
        body:content,
        scrollable:true
      });
      
      detailCard.show();
   });
      resultsMenu.show(); 
      //refresh to download new items upon twist of wrist
       resultsMenu.on('accelTap', function (e){
         ajax(
         {
           url:'https://api.uwaterloo.ca/v2/resources/infosessions.json?key=45a74e69a87e7f2dd15e3353987a9fa5',
           type: 'GET',
            dataType:'JSON'
         },
         function(rawdata){
           var data= JSON.parse(rawdata).data;
           var newItems=parseFeed(data, data.length);
           resultsMenu.items(0, newItems);
           vibe.vibrate('long');
         },
           function(error){
             console.log("Failed to download: "+error);
           }
         );
       });
  });
  },
  function(error){
    console.log(error + " occured");
  }
);

Accel.init();
  