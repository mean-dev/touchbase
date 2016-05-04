
mainApp.service('leads', [ function($rootScope, $filter) {

  var mObj = this;

  // dummy files
  var files = [];

  // tree
  this.leads = {
    'list' : function(){
        return [
          {
            'id'        :1,
            'name'      :'alex',
            'lname'     :'krizh',
            'email'     :'test@mail.ru',
            'activity'  :'2h',
            'image'     :'img/27.jpg',
            'history'   : [
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ],
            'notes':[
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ]
          },
          {
            'id'        :2,
            'name'      :'alex',
            'lname'     :'krizh',
            'email'     :'test@mail.ru',
            'activity'  :'2h',
            'image'     :'img/27.jpg',
            'history'   : [
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ],
            'notes':[
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ]
          },
          {
            'id'        :3,
            'name'      :'alex',
            'lname'     :'krizh',
            'email'     :'test@mail.ru',
            'activity'  :'2h',
            'image'     :'img/27.jpg',
            'history'   : [
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ],
            'notes':[
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ]
          },
          {
            'id'        :4,
            'name'      :'alex',
            'lname'     :'krizh',
            'email'     :'test@mail.ru',
            'activity'  :'2h',
            'image'     :'img/27.jpg',
            'history'   : [
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ],
            'notes':[
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'},
              {'title':'history title 1','date':'April 12, 2016 11:43 am', 'description':'descr small'}
            ]
          }
        ];
    },
    'history':function(id){
      return mObj.leads.list()[0]['history'];
    },
    'notes':function(id){
      return mObj.leads.list()[0]['notes'];
    }

  };

  this.lists = {

    'list' : function(){
        return mObj.leads.list()[0]['l'];
    }

  };

}]);
