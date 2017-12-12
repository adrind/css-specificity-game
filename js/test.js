$(function() {
	var TAG_NAMES = ['h1', 'p', 'div', 'span', 'h2'];
	var CLASS_NAMES = ['.container', '.title', '.part', '.puppy', '.item', '.article'];
	var ID_NAMES = ['#container', '#main', '#myElement', '#top', '#left', '#right', '#puppy']
	var PSEUDO_CLASS = [':active', ':any', ':any-link', ':checked', 
	':default', ':disabled', ':empty', ':enabled', ':first', ':first-child',
	':first-of-type', ':fullscreen', ':focus', ':hover', ':indeterminate',
	':in-range', ':last-child', ':last-child'];
	var PSEUDO_ELEMENTS = ['::after', '::before', '::cue', '::first-letter', '::first-line', '::selection'];

	var RULES = ['color: red;', 'color: blue;', 'font-size: 16px;', 'font-size: 22px;']

	var getRandom = function(arr) {
		return arr[Math.floor(Math.random()*arr.length)];
	};

	var getBoolean = function() {
		return Math.floor(Math.random() * 2)
	};

	var getType = function() {
		return getRandom(['tag', 'class', 'id']);
	};

	var hasPseudo = function() {
		return Math.floor(Math.random() * 10) === 4;
	}

	var getValue = function(type) {
		switch(type) {
			case 'tag':
				return getRandom(TAG_NAMES)
			case 'class':
				return getRandom(CLASS_NAMES)
			case 'id':
				return getRandom(ID_NAMES)
			default:
				return getRandom(TAG_NAMES)

		}
	};

	var createSelector = function(children) {
		var type = getType(),
			value = getValue(type);

		if(hasPseudo()) {
			pseudoEl = getRandom(PSEUDO_ELEMENTS);
			pseudoClass = '';
		} else {
			pseudoEl = '';
			pseudoClass = hasPseudo() ? getRandom(PSEUDO_CLASS) : '';
		}

		var selector = {
			type: type, 
			value: value, 
			pseudoEl: pseudoEl,
			pseudoClass: pseudoClass,
			children: []
		};

		if(children > 0){
			while(children > 0) {
				selector['children'].push(createSelector(0));
				children--;
			}
		}

		return selector;
	};

	var createSelectorHtml = function(selectorObj) {
		var html = '';
		if(selectorObj.pseudoEl || selectorObj.pseudoClass){
			html = selectorObj.value + selectorObj.pseudoEl + selectorObj.pseudoClass;
		} else {
			html = selectorObj.value;
		}

		if(selectorObj.children.length) {
			return html + ' ' + createSelectorHtml(selectorObj.children[0]);
		}

		return html;
	};

	var generateRule = function(selector) {
		var className = getRandom(CLASS_NAMES);
		var tagName = getRandom(TAG_NAMES);
		var selectorObj = createSelector(getBoolean());
		var ruleHTML = '<div class="css-rule">'+getRandom(RULES)+'</div>}';

		$(selector).html("<div class='selector'>"+createSelectorHtml(selectorObj)+"</div> {"+ruleHTML);
	};

	var checkResults = function(evt){
		var pickedFirst = $(evt.target).attr('id') === 'first-btn';
		var pickedTie = $(evt.target).attr('id') === 'tie-btn';
		var firstSelector = $('.first-rule .selector').text(),
			secondSelector = $('.second-rule .selector').text();
		var results = SPECIFICITY.compare(firstSelector, secondSelector);
		var resultText = '';
		var resultClass = '';


		if(results > 0) {
			resultText = pickedFirst ? "You're right!" : "You're wrong";
			resultClass = pickedFirst ? 'correct' : 'wrong';
		}
		if (results < 0) {
			resultText = pickedFirst || pickedTie ? "You're wrong" : "You're right!";
			resultClass = pickedFirst || pickedTie ? 'wrong' : 'correct';
		}

		if (results === 0) {
			resultText = pickedTie ? "You're right!" : "You're wrong";
			resultClass = pickedTie ? 'correct' : 'wrong';
		}

		$('#results').html(resultText);
		$('#results').addClass(resultClass);
	};

	$('#generate-btn').click(function(){
		$('#results').html('');
		$('#results').removeClass();
		generateRule('.first-rule .rule');
		generateRule('.second-rule .rule');
	});

	$('#first-btn').click(checkResults);
	$('#second-btn').click(checkResults);
	$('#tie-btn').click(checkResults);
});
