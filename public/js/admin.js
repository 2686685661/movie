$(()=>{
 
    $('.del').click((e)=>{
      
        let target = $(e.target);
        let id = target.data('id');
        let tr = $('.item-id-'+id);
        $.ajax({
            type:'DELETE',
            url:'/admin/movie/list?id='+id
        }).done((results)=>{
            if(results.success === 1){
                if(tr.length > 0) tr.remove();
            }
        })
    })

    $('#douban').blur(()=>{
        let id = $("input[name='douban']").val();
        console.log(id);
        if(id) {
            $.ajax({
                url:'https://api.douban.com/v2/movie/subject/' + id,
                cache: true,
                type: 'get',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success:(data) => {
                    $('#inputTitle').val(data.title);
                    $('#inputDoctor').val(data.directors[0].name);
                    $('#inputCountry').val(data.countries[0]);
                    $('#inputLanguage').val(data.year);
                    $('#inputPoster').val(data.images.large);
                    $('#inputYear').val(data.year);
                    $('#inputSummary').val(data.summary);
                }

            })

        }

    })
})