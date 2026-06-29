  fd.append('company',document.getElementById('b-company').value);
  fd.append('phone',document.getElementById('b-phone').value);
  fd.append('country',document.getElementById('b-country').value);
  fd.append('category',document.getElementById('b-category').value);
  fd.append('quantity',document.getElementById('b-qty').value);
  fd.append('target_price',document.getElementById('b-price').value);
  fd.append('file_link',document.getElementById('b-filelink').value);
  fd.append('message',document.getElementById('b-msg').value);
  fetch('https://api.web3forms.com/submit',{method:'POST',body:fd})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.success){
        showThankYou('Inquiry received.','Thank you for reaching out to SDF Clothing.','SDF-BYR-'+Date.now().toString(36).toUpperCase().slice(-6));
      } else {
        console.error('Web3Forms error:',JSON.stringify(d));
        alert('Submission failed: '+( d.message||'unknown error')+'. Please email contact@sdfltd.com directly.');
      }
    }).catch(function(err){
      console.error('Fetch error:',err);
      alert('Network error. Please email contact@sdfltd.com directly.');
    });
