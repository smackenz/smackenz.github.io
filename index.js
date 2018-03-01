var $panel = document.getElementById('panel');
var $content = document.getElementById('content');
var $viewer = document.getElementById('viewer');

function eventFire(el, etype){
  if (el.fireEvent) {
   (el.fireEvent('on' + etype));
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function selectItem(url) {
  var $items = $content.getElementsByTagName('li');
  var $found = null;
  for (var k = 0; k < $items.length; k++) {
    var $item = $items[k];
    if($item.getAttribute('data-url') === url) {
      if(!$item.classList.contains('selected')) $item.classList.add('selected')
    } else {
      if($item.classList.contains('selected')) $item.classList.remove('selected')
    }
  }
  return $found;
}

function createLink(text, url) {
  var link = document.createElement('a');
  link.className = 'link';
  link.href = '#';
  if(text) link.textContent = text;
  if(url) link.setAttribute('data-url', url);
  link.addEventListener('click', function (event) {
    event.preventDefault();
    selectItem(url);
    if(url.indexOf('api.github') >= 0) {
      fetch(url)
        .then(function(result) {
          return result.json();
        })
        .then(function(result) {
          console.log(result);
          var base = "data:text/html;base64," + result.content
          $viewer.setAttribute('src', base);
        })
        .catch(function(err) {
          console.log(err);
        })
    } else {
      $viewer.setAttribute('src', url);
    }
  });
  return link;
}

function renderLinks() {
  for (var i = 0; i < nav.length; i++) {
    var group = nav[i];
    var id = group['id'] || '';
    var text = group['text'] || '';
    var items = group['items'] || [];

    var $group = document.createElement('div');
    $group.className = 'group';
    $group.setAttribute('data-id', id);
    $group.setAttribute('data-text', text);

    var $header = document.createElement('h2');
    $header.textContent = text;

    var $list = document.createElement('ul');

    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var itext = item['text'] || '';
      var iurl = item['url'] || '';
      var $item = document.createElement('li');
      var $a = createLink(itext, iurl);
      $item.setAttribute('data-url', iurl);
      $item.appendChild($a);
      $list.appendChild($item);
    }

    $group.appendChild($header);
    $group.appendChild($list);
    $content.appendChild($group);
  }
}


renderLinks();

// Click first link
var $links = $content.getElementsByTagName('a');
if($links.length) {
  eventFire($links[0], 'click');
}