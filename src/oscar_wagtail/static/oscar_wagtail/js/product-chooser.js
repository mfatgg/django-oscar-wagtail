(function() {
/**
 * Once the product chooser modal has appeared, register the event
 * listeners we need for that.
 */
function setupModal(modal, jsonData) {


    var listingUrl = $('#product-chooser-list', modal.body).data('url');

    /**
     * Attach event handlers to the results. A live listener
     * because we replace the modal contents with Ajax.
     */
    modal.body.on('click', 'a.product-choice', function() {
        modal.loadUrl(this.href);
        return false;
    });

    /**
     * Handle pagination links. A live listener because we
     * replace the modal content with Ajax.
     */
    modal.body.on('click', '.pagination a', function() {
        var page = this.getAttribute('data-page');
        var q = $('form.product-search input[name=q]', modal.body).val();
        setPage(page, q);
        return false;
    });


    /**
     * Search the list
     */
    function search() {
        $.ajax({
            url: $('form.product-search', modal.body).attr('action'),
            data: {q: $('#id_q').val()},
            dataType: 'html',
            success: function(data, status, xhr) {
                var response = eval('(' + data + ')');
                $(modal.body).html(response.html);
                if (response.onload) {
                    response.onload(self);
                }
                ajaxifyLinks($('#product-results'));
            }
        });
        return false;
    }

    /**
     * Load page number ``page`` of the results.
     */
    function setPage(page, q) {

        $.ajax({
            url: listingUrl,
            data: { p: page, q: q },
            dataType: 'html',
            success: function(data, status, xhr) {
                var response = eval('(' + data + ')');
                $(modal.body).html(response.html);

                if (response.onload) {
                    response.onload(self);
                }

                ajaxifyLinks($('#product-chooser-list'));
            }
        });

        return false;
    }

    $('form.product-search', modal.body).submit(search);


}

/**
 * Registers the javascript hooks needed by the Wagtail admin
 * 'choose <product>' button.
 */
function setupWagtailWidget(id, url) {
    var chooserElement = $('#' + id + '-chooser');
    var docTitle = chooserElement.find('.title');
    var input = $('#' + id);
    var editLink = chooserElement.find('.edit-link');

    $('.action-choose', chooserElement).click(function() {
        ModalWorkflow({
            url: window.chooserUrls.productChooser,
            onload: {
                'show_product_chooser': setupModal
            },
            responses: {
                productChosen: function(productData) {
                    input.val(productData.id);
                    docTitle.text(productData.string);
                    chooserElement.removeClass('blank');
                    editLink.attr('href', productData.edit_link);
                }
            }
        });
    });

    $('.action-clear', chooserElement).click(function() {
        input.val('');
        chooserElement.addClass('blank');
    });
}

/**
 * Register a global function to be called when our model chooser widget
 * is rendered in Wagtail admin.
 */
window.createProductChooser = setupWagtailWidget;
})();
