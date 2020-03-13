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
  console.log( 'userId', userId );

  document.body.removeChild( $signin );

  const $app = document.createElement('div');
  document.body.appendChild( $app );

  const $newPost = document.createElement('h2');
  $newPost.innerHTML = 'make new post';
  $app.appendChild( $newPost );
  const $newPostForm = document.createElement('div');
  $app.appendChild( $newPostForm );
  $newPost.addEventListener( 'click', () => {
    makeNewPost( $newPostForm, userId );
  });

  const $sep1 = document.createElement('hr');
  $app.appendChild( $sep1 );

  const $postsTitle = document.createElement('h2');
  $postsTitle.innerHTML = 'postings';
  $app.appendChild( $postsTitle );
  const $posts = document.createElement('ul');
  $app.appendChild( $posts );

  const $sep2 = document.createElement('hr');
  $app.appendChild( $sep2 );

  const $selectedTitle = document.createElement('h2');
  $selectedTitle.innerHTML = 'selected post';
  $app.appendChild( $selectedTitle );
  const $selectedPost = document.createElement('div');
  $app.appendChild( $selectedPost );

  //listen for new posts
  firebase
  .firestore()
  .collection( 'posts' )
  .where( 'userId', '==', userId )
  .onSnapshot((snapshot) => {
    $posts.innerHTML = '';

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const $post = document.createElement('li');
      $post.innerHTML = data.title;
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
  $titleInfo.innerHTML = 'title: ' + data.title;
  $el.appendChild( $titleInfo );

  const $textInfo = document.createElement('div');
  $textInfo.innerHTML = 'text: ' + data.text;
  $el.appendChild( $textInfo );

}

var makeNewPost = function( $el, userId ) {
  const $titleInput = document.createElement('input');
  $el.appendChild( $titleInput );
  const $br1 = document.createElement('br');
  $el.appendChild( $br1 );
  const $textInput = document.createElement('input');
  $el.appendChild( $textInput );
  const $br2 = document.createElement('br');
  $el.appendChild( $br2 );
  const $submit = document.createElement('button');
  const $submitText = document.createTextNode( 'add this post!' );
  $submit.appendChild( $submitText );
  $submit.addEventListener( 'click', () =>{ 

    const postObj = {
      title: $titleInput.value,
      text: $textInput.value,
      userId: userId
    };

    //clear
    $el.innerHTML = '';

    firebase
    .firestore()
    .collection( 'posts' )
    .add( postObj )
    .then( () => {
      console.log( 'posted!' );
    })
    .catch( (e) => {
      console.log( 'could not post', e );
    });

  } );
  $el.appendChild( $submit );

}
