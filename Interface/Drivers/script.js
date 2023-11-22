
    const button = document.querySelectorAll('.btn-minecraft')
    button.forEach(btn => {
      btn.addEventListener('mouseleave', function (){
        btn.blur()
      })
    })