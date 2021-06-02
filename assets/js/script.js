// Date Picker //
var autoupdate = false;

function date1(){
$('.date-picker').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  minDate: 'today',
  autoApply: true,
  autoUpdateInput: autoupdate,
  locale: {
    format: 'YYYY-MM-DD'
  }
}, function(chosen_date) {
  $('.date-picker').val(chosen_date.format('YYYY-MM-DD'));
});
  };
date1();

$('.date-picker-2').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  minDate: 'today',
  autoApply: true,
  autoUpdateInput: false,
  locale: {
    format: 'YYYY-MM-DD'
  }
}, function(chosen_date) {
  $('.date-picker-2').val(chosen_date.format('YYYY-MM-DD'));
});

$('.date-picker').on('apply.daterangepicker', function(ev, picker) {
    if ($('.date-picker').val().length == 0 ){
    autoupdate = true;
    console.log('true');
    date1();
  };
  var departpicker = $('.date-picker').val();
  $('.date-picker-2').daterangepicker({
    minDate: departpicker,
    singleDatePicker: true,
    showDropdowns: true,
    autoApply: true,
    locale: {
      format: 'YYYY-MM-DD'
    }
  });
  
  var drp = $('.date-picker-2').data('daterangepicker');
  drp.setStartDate(departpicker);
  drp.setEndDate(departpicker);
});


$('#clear').click(function(){
 $('input.form-control').val('');
});
