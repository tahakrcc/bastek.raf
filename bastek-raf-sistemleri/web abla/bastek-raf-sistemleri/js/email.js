// EmailJS başlatma
(function() {
    emailjs.init("D5dQB7IwonR81ibGW");
})();

// Form gönderimi
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Form durumunu güncelle
    const formStatus = document.getElementById('form-status');
    formStatus.innerHTML = '<div class="loading">Mesajınız gönderiliyor...</div>';
    formStatus.className = 'form-status loading';
    
    // Form verilerini al
    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // EmailJS ile gönder
    emailjs.send('service_uiv3b6f', 'template_ujfgbd3', templateParams)
        .then(function(response) {
            // Başarılı gönderim
            formStatus.innerHTML = '<div class="success">Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</div>';
            formStatus.className = 'form-status success';
            document.getElementById('contact-form').reset();
        }, function(error) {
            // Hata durumu
            formStatus.innerHTML = '<div class="error">Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.</div>';
            formStatus.className = 'form-status error';
        });
}); 