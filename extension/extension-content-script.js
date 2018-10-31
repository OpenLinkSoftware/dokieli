
(function () {

  WebExtension = (typeof browser !== 'undefined') ? browser : chrome;

  var C = {
    'Loaded': false,
    'WebID': null
  }

  //iteraction with YouID content script for get current WebId
  window.addEventListener("message", recvMessage, false);

  function recvMessage(event)
  {
    var ev_data;

    if (String(event.data).lastIndexOf("youid_rc:",0)!==0)
      return;

    try {
      ev_data = JSON.parse(event.data.substr(9));
    } catch(e) {}


    if (ev_data && ev_data.webid) {
      var iri = ev_data.webid;

      if (C.Loaded && (C.WebID==null || C.WebID!=iri)) 
//??--         DO.U.submitSignIn(iri);
         DO.C.User.WebIdDelegate = iri; 

      C.WebID = iri;
    }
  }




  WebExtension.runtime.onMessage.addListener(function(request, sender, sendResponse)
  {
    var initialized = (DO!==undefined && DO.U!==undefined && C.Loaded);
    try {
      if (request.action == "dokieli.getUser") {
        sendResponse(DO.C.User);
      }
      else if (request.action == "dokieli.generateUUID") {
        sendResponse(DO.U.generateUUID());
      }
      else if (request.action == "dokieli.status")
      {
        // request current WebId from YouID.extension content script
        window.postMessage('youid:{"getWebId": true}', "*");
        // send to Dokieli backgroud script
        sendResponse({"dokieli":initialized}); 
      }
      else if (request.action == "dokieli.showDocumentMenu")
      {
        if (!C.Loaded) {
          var bodyAttributes = {
            "about": "",
//prev            "prefix", "rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns# rdfs: http://www.w3.org/2000/01/rdf-schema# owl: http://www.w3.org/2002/07/owl# xsd: http://www.w3.org/2001/XMLSchema# dcterms: http://purl.org/dc/terms/ dctypes: http://purl.org/dc/dcmitype/ foaf: http://xmlns.com/foaf/0.1/ v: http://www.w3.org/2006/vcard/ns# pimspace: http://www.w3.org/ns/pim/space# cc: http://creativecommons.org/ns# skos: http://www.w3.org/2004/02/skos/core# prov: http://www.w3.org/ns/prov# qb: http://purl.org/linked-data/cube# schema: http://schema.org/ rsa: http://www.w3.org/ns/auth/rsa# cert: http://www.w3.org/ns/auth/cert# cal: http://www.w3.org/2002/12/cal/ical# wgs: http://www.w3.org/2003/01/geo/wgs84_pos# org: http://www.w3.org/ns/org# biblio: http://purl.org/net/biblio# bibo: http://purl.org/ontology/bibo/ book: http://purl.org/NET/book/vocab# ov: http://open.vocab.org/terms/ sioc: http://rdfs.org/sioc/ns# doap: http://usefulinc.com/ns/doap# dbr: http://dbpedia.org/resource/ dbp: http://dbpedia.org/property/ sio: http://semanticscience.org/resource/ opmw: http://www.opmw.org/ontology/ deo: http://purl.org/spar/deo/ doco: http://purl.org/spar/doco/ cito: http://purl.org/spar/cito/ fabio: http://purl.org/spar/fabio/ oa: http://www.w3.org/ns/oa# as: http://www.w3.org/ns/activitystreams# ldp: http://www.w3.org/ns/ldp# solid: http://www.w3.org/ns/solid/terms# dio: https://w3id.org/dio#",
            "prefix": "rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns# rdfs: http://www.w3.org/2000/01/rdf-schema# owl: http://www.w3.org/2002/07/owl# xsd: http://www.w3.org/2001/XMLSchema# dcterms: http://purl.org/dc/terms/ dctypes: http://purl.org/dc/dcmitype/ foaf: http://xmlns.com/foaf/0.1/ pimspace: http://www.w3.org/ns/pim/space# cc: https://creativecommons.org/ns# skos: http://www.w3.org/2004/02/skos/core# prov: http://www.w3.org/ns/prov# mem: http://mementoweb.org/ns# qb: http://purl.org/linked-data/cube# schema: http://schema.org/ void: http://rdfs.org/ns/void# rsa: http://www.w3.org/ns/auth/rsa# cert: http://www.w3.org/ns/auth/cert# wgs: http://www.w3.org/2003/01/geo/wgs84_pos# bibo: http://purl.org/ontology/bibo/ sioc: http://rdfs.org/sioc/ns# doap: http://usefulinc.com/ns/doap# dbr: http://dbpedia.org/resource/ dbp: http://dbpedia.org/property/ sio: http://semanticscience.org/resource/ opmw: http://www.opmw.org/ontology/ deo: http://purl.org/spar/deo/ doco: http://purl.org/spar/doco/ cito: http://purl.org/spar/cito/ fabio: http://purl.org/spar/fabio/ oa: http://www.w3.org/ns/oa# as: https://www.w3.org/ns/activitystreams# ldp: http://www.w3.org/ns/ldp# solid: http://www.w3.org/ns/solid/terms# acl: http://www.w3.org/ns/auth/acl# dio: https://w3id.org/dio# rel: https://www.w3.org/ns/iana/link-relations/relation#",
            "typeof": "schema:CreativeWork sioc:Post prov:Entity schema:Article"
          }

          Object.keys(bodyAttributes).forEach(function(attribute){
            if(!document.body.getAttribute(attribute)){
              document.body.setAttribute(attribute, bodyAttributes[attribute]);
            }
          });

        document.head.insertAdjacentHTML('beforeend', '<style type="text/css">@font-face{font-family:"FontAwesome" ;src:url("' + WebExtension.extension.getURL('/media/fonts/fontawesome-webfont.eot?v=4.7.0') + '");src:url("' + WebExtension.extension.getURL('/media/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') + '") format("embedded-opentype"),url("' + WebExtension.extension.getURL('/media/fonts/fontawesome-webfont.woff2?v=4.7.0') + '") format("woff2"),url("' + WebExtension.extension.getURL('/media/fonts/fontawesome-webfont.woff?v=4.7.0') + '") format("woff"),url("' + WebExtension.extension.getURL('/media/fonts/fontawesome-webfont.ttf?v=4.7.0') + '") format("truetype"),url("' + WebExtension.extension.getURL('/media/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') + '") format("svg"); }</style>');
//--    document.body.innerHTML = '<main><article about="" typeof="schema:Article"><div id="content">' + document.body.innerHTML + '</div></article></main>';
//--        document.body.innerHTML = '<main><article about="" typeof="schema:Article" id="content">' + document.body.innerHTML + '</article></main>';

        document.body.innerHTML = '<main class="article" id="content" about="" typeof="schema:Article">' + document.body.innerHTML + '</main>';

          DO.U.init();
          C.Loaded = true;
        }

        sendResponse({}); /* stop */

//??--        if (C.WebID!==null)
//??--          DO.U.submitSignIn(C.WebID);
        DO.C.User.WebIdDelegate = C.WebID;

        window.setTimeout(function () {
          DO.U.showDocumentMenu();
        }, 50);
      }
      else
      {
        sendResponse({}); /* stop */
      }
    } catch(e) {
      console.log("dokieli: runtime.onMessage.addListener: " + e);
    }

  });



})();
