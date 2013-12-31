// sample code for using tabletop directly (for publicly available spreadsheets)

$( init() );

function init() {
  Tabletop.init( { key: credentials.key,
                   callback: showInfo,
                   simpleSheet: true } )
}

function showInfo(data, tabletop) {
  console.log(data);
}
