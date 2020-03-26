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

  const $newPost = document.createElement('h2');
  $newPost.innerHTML = 'add new animals';
  $app.appendChild( $newPost );
  const $newPostForm = document.createElement('div');
  $app.appendChild( $newPostForm );
  $newPost.addEventListener( 'click', () => {
    makeNewPost( $newPostForm, userId );
  });

  const $sep1 = document.createElement('hr');
  $app.appendChild( $sep1 );

  const $postsTitle = document.createElement('h2');
  $postsTitle.innerHTML = 'animals';
  $app.appendChild( $postsTitle );
  const $posts = document.createElement('ul');
  $app.appendChild( $posts );

  const $sep2 = document.createElement('hr');
  $app.appendChild( $sep2 );

  const $selectedTitle = document.createElement('h2');
  $selectedTitle.innerHTML = 'selected animal';
  $app.appendChild( $selectedTitle );
  const $selectedPost = document.createElement('div');
  $app.appendChild( $selectedPost );

  //listen for new posts
  firebase
  .firestore()
  .collection( 'animals' )
  .where( 'userId', '==', userId )
  .onSnapshot((snapshot) => {
    $posts.innerHTML = '';

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const $post = document.createElement('li');
      $post.innerHTML = data.animal;
      $post.addEventListener( 'click', () => {
        showSelectedPost( $selectedPost, data );
      });

      $posts.appendChild( $post );
    }
  });  
}

var showSelectedPost = function( $el, data ) {
  $el.innerHTML = '';

  const $titleInfo = document.createElement('div');
  $titleInfo.innerHTML = 'animal: ' + data.animal;
  $el.appendChild( $titleInfo );

  const $textInfo = document.createElement('div');
  $textInfo.innerHTML = 'food: ' + data.food;
  $el.appendChild( $textInfo );

  const $dateInfo = document.createElement('div');
  $dateInfo.innerHTML = 'name: ' + data.name;
  $el.appendChild( $dateInfo );

}

var makeNewPost = function( $el, userId ) {
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
  const $foodInput = document.createElement('input');
  $el.appendChild( $foodInput );
  var foodsListKey = 'foods';
  $foodInput.setAttribute( 'list', foodsListKey );
  const $foodList = document.createElement('datalist');
  $foodList.setAttribute( 'id', foodsListKey );
  $foodInput.appendChild( $foodList );

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

    const postObj = {
      animal: $animalInput.value,
      food: $foodInput.value,
      userId: userId,
      name: $nameInput.value
    };

    //clear
    $el.innerHTML = '';

    firebase
    .firestore()
    .collection( 'animals' )
    .add( postObj )
    .then( () => {
      console.log( 'posted!' );
    })
    .catch( (e) => {
      console.log( 'could not post', e );
    });

  } );
  $el.appendChild( $submit );


  //listen for new posts
  firebase
  .firestore()
  .collection( 'foods' )
  .onSnapshot((snapshot) => {
    $foodList.innerHTML = '';

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const $option = document.createElement('option');
      $option.innerHTML = data.food;
      $foodList.appendChild( $option );
    }
  });

}
