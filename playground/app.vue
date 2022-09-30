<template>
  <div class="external">
    <h1 class="red">
      Hey!
    </h1>
    <div>
      <p>Green</p>
    </div>
  </div>
</template>

<style scoped>
.red {
  color: red;
}

.blue {
  color: blue;
}

:deep(div) {
  color: green;
}

.safe {
  color: rebeccapurple;
}
/* purgecss start ignore */
inline {
  color: salmon;
}
/* purgecss end ignore */
</style>
