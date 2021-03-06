//
//  authentication
//
//https://firebase.google.com/docs/auth/web/start

const $signin = document.createElement('div');
$signin.innerHTML = 'signin';
$signin.addEventListener( 'click', () => {
  popupSignIn();
});
document.body.appendChild( $signin );


var popupSignIn = function( ) {
  // User is signed out.
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    launchApp( user.uid );

    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

var launchApp = function( userId ) {
  document.body.removeChild( $signin );

  const $app = document.createElement('div');
  document.body.appendChild( $app );

  const $newFood = document.createElement('h2');
  $newFood.innerHTML = 'add new foods';
  $app.appendChild( $newFood );
  const $newFoodForm = document.createElement('div');
  $app.appendChild( $newFoodForm );
  $newFood.addEventListener( 'click', () => {
    makeNewFood( $newFoodForm, userId );
  });

  const $sep0 = document.createElement('hr');
  $app.appendChild( $sep0 );

  const $newAnimal = document.createElement('h2');
  $newAnimal.innerHTML = 'add new animals';
  $app.appendChild( $newAnimal );
  const $newAnimalForm = document.createElement('div');
  $app.appendChild( $newAnimalForm );
  $newAnimal.addEventListener( 'click', () => {
    makeNewAnimal( $newAnimalForm, userId );
  });

  const $sep1 = document.createElement('hr');
  $app.appendChild( $sep1 );

  const $animalsTitle = document.createElement('h2');
  $animalsTitle.innerHTML = 'animals';
  $app.appendChild( $animalsTitle );
  const $animals = document.createElement('ul');
  $app.appendChild( $animals );

  const $sep2 = document.createElement('hr');
  $app.appendChild( $sep2 );

  const $selectedTitle = document.createElement('h2');
  $selectedTitle.innerHTML = 'selected animal';
  $app.appendChild( $selectedTitle );
  const $selectedPost = document.createElement('div');
  $app.appendChild( $selectedPost );

  const $sep3 = document.createElement('hr');
  $app.appendChild( $sep3 );

  const $foodsTitle = document.createElement('h2');
  $foodsTitle.innerHTML = 'foods';
  $app.appendChild( $foodsTitle );
  const $foods = document.createElement('ul');
  $app.appendChild( $foods );

  const $sep4 = document.createElement('hr');
  $app.appendChild( $sep4 );

  const $selectedFoodTitle = document.createElement('h2');
  $selectedFoodTitle.innerHTML = 'selected food';
  $app.appendChild( $selectedFoodTitle );
  const $selectedFood = document.createElement('div');
  $app.appendChild( $selectedFood );

  // listen for new animals
  firebase
  .firestore()
  .collection( 'animals' )
  .where( 'userId', '==', userId )
  .onSnapshot((snapshot) => {
    $animals.innerHTML = '';

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const $post = document.createElement('li');
      $post.innerHTML = data.animal;
      $post.addEventListener( 'click', () => {
        showSelectedAnimal( $selectedPost, data );
      });

      $animals.appendChild( $post );
    }
  });

  //& foods
  firebase
  .firestore()
  .collection( 'foods' )
  .where( 'userId', '==', userId )
  .onSnapshot((snapshot) => {
    $foods.innerHTML = '';

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const $post = document.createElement('li');
      $post.innerHTML = data.food;
      $post.addEventListener( 'click', () => {
        showSelectedFood( $selectedFood, data );
      });

      $foods.appendChild( $post );
    }
  });  
}

var showSelectedFood = function( $el, data ) {
  $el.innerHTML = '';
  const $info = document.createElement('div');
  $el.appendChild( $info );
  $info.innerHTML = data.food + ' is eaten by:';
  const $list = document.createElement('ul');
  $el.appendChild( $list );
  for (const animalDoc of data.animals) {
    animalDoc
    .get()
    .then( snapshot => {
      const $li = document.createElement( 'li' );
      $list.appendChild( $li );
      $li.innerHTML = snapshot.data().name + ' the ' + snapshot.data().animal;
    });
  }


}

var showSelectedAnimal = function( $el, data ) {
  $el.innerHTML = '';

  const $titleInfo = document.createElement('div');
  $titleInfo.innerHTML = 'animal: ' + data.animal;
  $el.appendChild( $titleInfo );

  const $textInfo = document.createElement('div');
  $textInfo.innerHTML = 'food:';
  $el.appendChild( $textInfo );

  const $dateInfo = document.createElement('div');
  $dateInfo.innerHTML = 'name: ' + data.name;
  $el.appendChild( $dateInfo );

  data
  .food
  .get()
  .then( snapshot => {
    $textInfo.innerHTML = 'food: ' + snapshot.data().food;
  });
  
}

var makeNewFood = function( $el, userId ) {
  const $foodLabel = document.createElement('div');
  $foodLabel.innerHTML = 'FOOD:';
  $el.appendChild( $foodLabel );
  const $foodInput = document.createElement('input');
  $el.appendChild( $foodInput );

  const $br3 = document.createElement('br');
  $el.appendChild( $br3 );
  const $submit = document.createElement('button');
  const $submitText = document.createTextNode( 'add this food!' );
  $submit.appendChild( $submitText );
  $el.appendChild( $submit );

  $submit.addEventListener( 'click', () =>{ 

    const postObj = {
      food: $foodInput.value,
      userId: userId
    };

    firebase
    .firestore()
    .collection( 'foods' )
    .add( postObj )
    .then( () => {
      console.log( 'posted!' );
    })
    .catch( (e) => {
      console.log( 'could not post', e );
    });
    
    $el.innerHTML = '';

  });
}

var makeNewAnimal = function( $el, userId ) {
  var foodDocs = {};

  const $animalLabel = document.createElement('div');
  $animalLabel.innerHTML = 'ANIMAL:';
  $el.appendChild( $animalLabel );
  const $animalInput = document.createElement('input');
  $el.appendChild( $animalInput );

  const $br1 = document.createElement('br');
  $el.appendChild( $br1 );

  const $foodLabel = document.createElement('div');
  $foodLabel.innerHTML = 'FOOD:';
  $el.appendChild( $foodLabel );
  const $foodInput = document.createElement('div');
  $el.appendChild( $foodInput );


  const $br2 = document.createElement('br');
  $el.appendChild( $br2 );

  const $nameLabel = document.createElement('div');
  $nameLabel.innerHTML = 'NAME:';
  $el.appendChild( $nameLabel );
  const $nameInput = document.createElement('input');
  $el.appendChild( $nameInput );

  const $br3 = document.createElement('br');
  $el.appendChild( $br3 );
  const $submit = document.createElement('button');
  const $submitText = document.createTextNode( 'add this animal!' );

  $submit.appendChild( $submitText );
  $submit.addEventListener( 'click', () =>{ 

    const checkedFood = document.querySelector('input[name="foodz"]:checked');
    if (!checkedFood) {
      return;
    }
    const foodKey = checkedFood.id;
    const foodDoc = foodDocs[foodKey];

    const postObj = {
      animal: $animalInput.value,
      food: foodDoc,
      userId: userId,
      name: $nameInput.value
    };

    //clear
    $el.innerHTML = '';

    firebase
    .firestore()
    .collection( 'animals' )
    .add( postObj )
    .then( ( animalDoc ) => {

      foodDoc
      .update({
        animals: firebase.firestore.FieldValue.arrayUnion( animalDoc )
      })

    })
    .catch( (e) => {
      console.log( 'could not post', e );
    });

  });
  $el.appendChild( $submit );


  //listen for new foods
  firebase
  .firestore()
  .collection( 'foods' )
  .where( 'userId', '==', userId )
  .onSnapshot((snapshot) => {
    $foodInput.innerHTML = '';
    foodDocs = {};

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const id = doc.id;
      const $option = document.createElement('input');
      $option.setAttribute( 'type', 'radio' );
      $option.setAttribute( 'id', id );
      $option.setAttribute( 'value', data.food );
      $option.setAttribute( 'name', 'foodz' );
      $foodInput.appendChild( $option );

      const $label = document.createElement('label');
      $label.setAttribute( 'for', id );
      $label.innerHTML = data.food;
      $foodInput.appendChild( $label );

      foodDocs[id] = doc.ref;
    }
  });

}
