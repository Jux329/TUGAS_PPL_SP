<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu</title>
    @vite('resources/css/app.css')
    <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>     <!-- ini script untuk otomatis kategori -->
     <script>
  document.addEventListener('alpine:init', () => {
    Alpine.store('shop', {
      activeCategory: 'semua'
    });
  });
</script>
     
</head>
<body>
<!-- Include this script tag or install `@tailwindplus/elements` via npm: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script> -->
<!--
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-100">
  <body class="h-full">
  ```
-->
<div class="min-h-full">
  <x-navbar>
    
  </x-navbar>
  <br>
  <x-kategori>
  </x-kategori>
  

  <x-productcom>

  </x-productcom>
  <main>
    
  </main>
  <x-footer>
  </x-footer>
</div>

</body>
</html>