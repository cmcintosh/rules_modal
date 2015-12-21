Drupal.behaviors.rules_modal_display = {
  attach: function(context, settings) {
    (function ($) {

      $(document).ready(function(){
        $('[type="submit"], [type="button"]').click(function(e){

          var form_id = $(this).closest('form').attr('id');
          var form = $(this).closest('form');
          if (form_id == 'rules-admin-add-reaction-rule' || form_id == 'rules-ui-add-element' || form_id.indexOf('rules-ui-add-element') > -1) {
            return true;
          }

          var form_data = {};
          form.find('input, select, fieldset input, fieldset select').each(function(){
            var self = $(this);
            if( $(this).is(':radio') ){
              form_data[self.attr('name')] = self.attr('checked') ? self.val() : 0;
            }
            else if($(this).is(':checkbox')) {
               form_data[self.attr('name')] = self.attr('checked') ? self.val() : 0;
            }
            else {
                form_data[self.attr('name')] = self.val();
            }
          });

          $.ajax({
            url: '/rules_modal/' + form_id,
            data: { data : form_data },
            type: 'POST',
            success: function(response) {
              console.log(response);
              if(response.continue){

                if (response.submit) {
                    $('#modalContent .close').trigger('click');
                    console.log($("#" + response.submit).length);
                    $('#' + response.submit).submit();
                }
                else {
                  form.submit();
                }
              }
              else if(response.modal) {
                Drupal.settings.rules_modal_data = {};
                Drupal.CTools.Modal.show('rules_modal_data');
                $('#modal-title').html(response.title);
                $('#modal-content').html(response.content).scrollTop(0);
                Drupal.attachBehaviors();
              }

            }
          });
          return false;
        });
      });

    }(jQuery));
  },
  show: function(url) {

    (function ($) {
      $(document).ready(function(){
        // Create a drupal ajax object
        var obj = $('<a></a>');
        $(obj).click(Drupal.CTools.Modal.clickAjaxLink);        // This is to pop up the modal as soon as the user clicks the element.
        var element_settings = {};
        element_settings.url = "/" + url;
        element_settings.event = 'click';
        element_settings.progress = { type: 'throbber' };
        var base = "/" + url;
        Drupal.ajax[base] = new Drupal.ajax(base, obj, element_settings);
        $(obj).addClass('modal-trigger-processed');
        $(obj).trigger('click');
      });
    }(jQuery));
  }
};
