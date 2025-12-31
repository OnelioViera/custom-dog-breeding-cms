"use client";

import * as React from "react"
import { usePathname } from "next/navigation"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disablePreset?: boolean; // Opt-out of button preset styling
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disablePreset, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const pathname = usePathname()
    
    // Automatically disable presets for admin routes unless explicitly enabled
    const shouldDisablePreset = disablePreset !== undefined 
      ? disablePreset 
      : pathname?.startsWith("/admin") ?? false
    
    // Get dynamic styles from CSS variables
    const getButtonStyles = (): React.CSSProperties => {
      if (typeof window === "undefined" || shouldDisablePreset) {
        return {}; // Return empty styles during SSR or if preset is disabled
      }
      
      const styles: React.CSSProperties = {};
      
      // Border radius from CSS variable
      const borderRadius = getComputedStyle(document.documentElement)
        .getPropertyValue("--button-border-radius")
        .trim();
      if (borderRadius) {
        styles.borderRadius = borderRadius;
      }
      
      // Size-specific styles
      if (size === "sm") {
        const height = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-sm-height")
          .trim();
        const paddingX = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-sm-padding-x")
          .trim();
        const fontSize = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-sm-font-size")
          .trim();
        if (height) styles.height = height;
        if (paddingX) {
          styles.paddingLeft = paddingX;
          styles.paddingRight = paddingX;
        }
        if (fontSize) styles.fontSize = fontSize;
      } else if (size === "lg") {
        const height = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-lg-height")
          .trim();
        const paddingX = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-lg-padding-x")
          .trim();
        const fontSize = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-lg-font-size")
          .trim();
        if (height) styles.height = height;
        if (paddingX) {
          styles.paddingLeft = paddingX;
          styles.paddingRight = paddingX;
        }
        if (fontSize) styles.fontSize = fontSize;
      } else if (size !== "icon") {
        const height = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-default-height")
          .trim();
        const paddingX = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-default-padding-x")
          .trim();
        const fontSize = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-default-font-size")
          .trim();
        if (height) styles.height = height;
        if (paddingX) {
          styles.paddingLeft = paddingX;
          styles.paddingRight = paddingX;
        }
        if (fontSize) styles.fontSize = fontSize;
      }
      
      // Variant-specific colors
      if (variant === "default") {
        const bg = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-primary")
          .trim();
        const text = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-text")
          .trim();
        if (bg) styles.backgroundColor = bg;
        if (text) styles.color = text;
      } else if (variant === "secondary") {
        const bg = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-secondary")
          .trim();
        const text = getComputedStyle(document.documentElement)
          .getPropertyValue("--button-text")
          .trim();
        if (bg) styles.backgroundColor = bg;
        if (text) styles.color = text;
      }
      
      return styles;
    };
    
    const [buttonStyles, setButtonStyles] = React.useState<React.CSSProperties>(() => getButtonStyles());
    
    React.useEffect(() => {
      // Don't set up preset listeners if presets are disabled
      if (shouldDisablePreset) {
        setButtonStyles({});
        return;
      }
      
      const updateStyles = () => {
        const newStyles = getButtonStyles();
        // Only update if styles actually changed
        setButtonStyles((prevStyles) => {
          const prevStr = JSON.stringify(prevStyles);
          const newStr = JSON.stringify(newStyles);
          if (prevStr !== newStr) {
            return newStyles;
          }
          return prevStyles;
        });
      };
      
      // Initial update with delay to ensure CSS is loaded
      requestAnimationFrame(() => {
        setTimeout(updateStyles, 100);
        setTimeout(updateStyles, 300);
      });
      
      // Listen for custom event when preset is updated
      const handlePresetUpdate = () => {
        // Use requestAnimationFrame to ensure DOM is ready, then update multiple times
        requestAnimationFrame(() => {
          updateStyles();
          setTimeout(updateStyles, 50);
          setTimeout(updateStyles, 150);
          setTimeout(updateStyles, 300);
        });
      };
      window.addEventListener("buttonPresetUpdated", handlePresetUpdate);
      
      // Listen for theme/preset changes via DOM mutations
      const observer = new MutationObserver((mutations) => {
        // Only update if style-related changes occurred
        const hasStyleChanges = mutations.some(mutation => 
          mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')
        );
        if (hasStyleChanges) {
          requestAnimationFrame(() => {
            setTimeout(updateStyles, 50);
          });
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["style", "class"],
        childList: true,
        subtree: true,
      });
      
      // Also listen for style tag additions in head (when preset CSS is injected)
      const styleObserver = new MutationObserver((mutations) => {
        // Check if a style tag was added or modified
        const hasStyleTagChanges = mutations.some(mutation => 
          mutation.addedNodes.length > 0 && 
          Array.from(mutation.addedNodes).some((node: any) => 
            node.tagName === 'STYLE' && (node.id === 'button-preset-styles' || node.id?.startsWith('button-preset-'))
          )
        );
        if (hasStyleTagChanges) {
          requestAnimationFrame(() => {
            setTimeout(updateStyles, 100);
            setTimeout(updateStyles, 250);
          });
        }
      });
      styleObserver.observe(document.head, {
        childList: true,
        subtree: true,
      });
      
      return () => {
        window.removeEventListener("buttonPresetUpdated", handlePresetUpdate);
        observer.disconnect();
        styleObserver.disconnect();
      };
    }, [variant, size, shouldDisablePreset]);
    
    // For admin buttons, don't apply preset styles at all
    const finalStyles = shouldDisablePreset ? {} : buttonStyles;
    
    // When preset styles are active, we need to override Tailwind classes
    // Remove color-related Tailwind classes and use inline styles instead
    const getButtonClassName = () => {
      if (shouldDisablePreset || Object.keys(finalStyles).length === 0) {
        // No preset active, use normal Tailwind classes
        return cn(buttonVariants({ variant, size }), className);
      }
      
      // Preset is active - remove color classes and use inline styles
      const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
      
      // Get size classes (but not color classes)
      let sizeClasses = "";
      if (size === "icon") {
        sizeClasses = "h-10 w-10";
      }
      
      return cn(baseClasses, sizeClasses, className);
    };
    
    // Merge any existing inline styles from props
    // Preset styles should take precedence, but allow props.style to override if needed
    const mergedStyles = props.style 
      ? { ...props.style, ...finalStyles } 
      : finalStyles;
    
    return (
      <Comp
        className={getButtonClassName()}
        style={mergedStyles}
        data-button-variant={variant === "default" || variant === "secondary" ? variant : undefined}
        data-admin-button={shouldDisablePreset ? "true" : undefined}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
