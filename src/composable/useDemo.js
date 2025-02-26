import { computed, onMounted, ref } from 'vue';

const useDemo = (props) => {
  const theme = ref('dark');
  const selectedVariantIndex = ref(0);
  const selectedTheme = ref('');
  const isCopy = ref(false);
  const messageCopy = ref('');

  onMounted(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      theme.value = storedTheme;
    }
    selectedTheme.value = theme.value || 'dark';
  });

  const toggleTheme = () => {
    theme.value = selectedTheme.value;
    localStorage.setItem('theme', theme.value);
  };
  
  const variant = computed(() => props.variants?.[selectedVariantIndex.value] || {});
  
  const customStyle = computed(() => {
    const style = theme.value === 'dark' ? props.demoStyle?.dark : props.demoStyle?.light;
    return {
      body: {
        backgroundColor: style?.backgroundBody || '',
        color: style?.color || '',
      },
      content: {
        backgroundColor: style?.backgroundContent || '',
        color: style?.color || '',
      },
    };
  });
  
  const setClickItem = (item) => {
    let commandToCopy = "";
    
    if (item === "npm") {
      commandToCopy = `npm install ${props.isDevComponent ? '-D ' : ''}${props.npmInstall}`;
    } else {
      commandToCopy = `git clone ${props.urlClone}`;
    }
    
    navigator.clipboard.writeText(commandToCopy)
      .then(() => {
        isCopy.value = true;
        messageCopy.value = `✅ Copied: ${commandToCopy}`;
      })
      .catch(err => {
        isCopy.value = true;
        messageCopy.value = `❌ Failed to copy: ${err}`;
      })
      .finally(() => {
        setTimeout(() => {
          isCopy.value = false;
          messageCopy.value = "";
        }, 2000);
      });
  };
  
  return {
    customStyle,
    isCopy,
    messageCopy,
    selectedTheme,
    selectedVariantIndex,
    theme,
    variant,
    
    setClickItem,
    toggleTheme,
  };
};

export default useDemo;
