
<template>
    <div>
      <NavBar/>
      <div class="container mt-4"> <!-- Aggiunto un container di Bootstrap per centrare e allineare il contenuto -->
        <SignUp/>
      </div>
    </div>
  </template>
  
  <script>

  import Registrazione from '@/components/Registrazione'
  
  export default {
    name: 'RegistrazioneView',
    components: { 
      Registrazione
    }
  }
  </script>
  
