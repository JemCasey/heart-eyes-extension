$('#table-body').empty();
chrome.storage.sync.get('customEmojis', function(data) {
    data = JSON.parse(data.customEmojis || "{}");
    defaultEmojis.forEach(e => {
        $('#table-body')
            .append($('<tr/>')
            .append($('<td/>', { text: e }))
            .append($('<td/>', { class: 'custom', text: data[e] || e }))
            .append($('<td/>')
            .append($(`<button type="button" class="btn btn-outline-primary update-btn" id="${e}">Update</button>`))))
    });

    var popoverHtml = $('<div/>')
        .append($('<div/>', { class: 'container' })
        .append($('<div/>', { class: 'row' })));
    var popoverRow = popoverHtml.find('.row');

    allEmojis.forEach(e => {
        popoverRow.append($('<div/>', { class: 'col-3' })
            .append($('<span/>', { class: 'emoji-button', text: e })));
    });

    $('.update-btn').popover({
        placement: 'bottom',
        container: 'body',
        html: true,
        trigger: 'click',
        content: popoverHtml.html()
    });

    $('body').on('click', '.emoji-button', function() {
        var selectedEmoji = $(this).text();
        var clickedButton = $($(this).closest('.popover').data('bs.popover').element);
        var emojiToReplace = clickedButton.attr('id');

        clickedButton.parent().parent().find('.custom').text(selectedEmoji);
        data[emojiToReplace] = selectedEmoji;

        chrome.storage.sync.set({ customEmojis: JSON.stringify(data) });
        chrome.extension.getBackgroundPage().customEmojis = data;
        $('.popover').hide();
    });

    $('body').on('click', function (e) {
        if (!$(e.target).data('bs.popover') && $(e.target).parents('.popover').length === 0) { 
            $('.popover').hide();
        }
    });
});