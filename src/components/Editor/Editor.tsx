import React, { useState, useRef } from "react";
import { Controller, Control } from "react-hook-form";
import icons from "./icons";

type Props = {
  description?: string;
  name?: string;
  onChangeText?: React.Dispatch<React.SetStateAction<string>>;
  control: Control<any>;
};

const Editor: React.FC<Props> = ({ description, name, onChangeText, control }) => {
  const [text, setText] = useState<string>(description || "");
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTextAtCurrentLine = (textToInsert: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart ?? 0;

      const before = text.slice(0, start);
      const after = text.slice(start);

      const beforeLine = before.slice(0, before.lastIndexOf("\n") + 1);
      const currentLine = before.slice(before.lastIndexOf("\n") + 1);
      const lineEnd = currentLine.indexOf("\n") !== -1 ? currentLine.indexOf("\n") : currentLine.length;

      let newText;

      if (textToInsert === "h1. " || textToInsert === "h3. " || textToInsert === "h2. ") {
        if (
          !currentLine.startsWith(textToInsert) &&
          (currentLine.startsWith("h1. ") || currentLine.startsWith("h2. ") || currentLine.startsWith("h3. "))
        ) {
          newText = `${beforeLine}${textToInsert}${currentLine.substring(4, lineEnd)}${after}`;
        } else if (currentLine.startsWith(textToInsert)) {
          newText = `${beforeLine}${currentLine.substring(0, lineEnd)}${after}`;
        } else {
          newText = `${beforeLine}${textToInsert}${currentLine.substring(0, lineEnd)}${after}`;
        }
      } else if (textToInsert === "* " || textToInsert === "# ") {
        if ((textToInsert === "* " && currentLine.startsWith("# ")) || (textToInsert === "# " && currentLine.startsWith("* "))) {
          newText = `${beforeLine}${textToInsert}${currentLine.substring(2, lineEnd)}${after}`;
        } else {
          newText = `${beforeLine}${textToInsert}${currentLine.substring(0, lineEnd)}${after}`;
        }
      } else if (textToInsert === "> " || textToInsert === "< ") {
        if (currentLine.startsWith("> ") && textToInsert === "< ") {
          newText = `${beforeLine}${currentLine.substring(2, lineEnd)}${after}`;
        } else if (textToInsert === "< " && !currentLine.startsWith("> ")) {
          newText = `${beforeLine}${currentLine.substring(0, lineEnd)}${after}`;
        } else {
          newText = `${beforeLine}${textToInsert}${currentLine.substring(0, lineEnd)}${after}`;
        }
      } else if (textToInsert === "<pre>") {
        newText = `${textToInsert}\n${beforeLine}${currentLine.substring(0, lineEnd)}${after}\n</pre>`;
      } else {
        newText = `${beforeLine}${textToInsert}${currentLine.substring(0, lineEnd)}${after}`;
      }

      setText(newText);
      onChangeText?.(newText);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.selectionStart = start + textToInsert.length;
          textareaRef.current.selectionEnd = start + textToInsert.length;
        }
      }, 0);
      // Chèn ký tự vào đầu dòng hiện tại
    }
  };

  const formatText = (prefix: string, suffix?: string) => {
    const start = selectionStart;
    const end = selectionEnd;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const newText = selected ? `${before}${prefix}${selected}${suffix ?? prefix}${after}` : `${before}${prefix}${suffix ?? prefix}${after}`;

    setText(newText);
    onChangeText?.(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = end + (selected.length ? prefix.length * 2 : prefix.length);

        textareaRef.current.selectionEnd = end + (selected.length ? prefix.length * 2 : prefix.length);
        setSelectionStart(end + (selected.length ? prefix.length * 2 : prefix.length));
        setSelectionEnd(end + (selected.length ? prefix.length * 2 : prefix.length));
      }
    }, 0);
  };

  const itemToolbar = [
    {
      label: "Bold",
      icon: icons.bold,
      action: () => formatText("*"),
    },
    {
      label: "Italic",
      icon: icons.italic,
      action: () => formatText("_"),
    },
    {
      label: "Underline",
      icon: icons.underline,
      action: () => formatText("+"),
    },
    {
      label: "Delete",
      icon: icons.del,
      action: () => formatText("-"),
    },
    {
      label: "Code",
      icon: icons.code,
      action: () => formatText("@"),
    },
    {
      label: "Heading1",
      icon: icons.heading1,
      action: () => insertTextAtCurrentLine("h1. "),
    },
    {
      label: "Heading2",
      icon: icons.heading2,
      action: () => insertTextAtCurrentLine("h2. "),
    },
    {
      label: "Heading3",
      icon: icons.heading3,
      action: () => insertTextAtCurrentLine("h3. "),
    },
    {
      label: "UnOrderList",
      icon: icons.unorderedList,
      action: () => insertTextAtCurrentLine("* "),
    },
    {
      label: "OrderList",
      icon: icons.orderedList,
      action: () => insertTextAtCurrentLine("# "),
    },
    {
      label: "TextRight",
      icon: icons.rightAlign,
      action: () => insertTextAtCurrentLine("> "),
    },
    {
      label: "TextLeft",
      icon: icons.leftAlign,
      action: () => insertTextAtCurrentLine("< "),
    },
    {
      label: "TextPre",
      icon: icons.pre,
      action: () => insertTextAtCurrentLine("<pre>"),
    },
    {
      label: "Link",
      icon: icons.link,
      action: () => formatText("[[", "]]"),
    },
    {
      label: "Image",
      icon: icons.image,
      action: () => formatText("!"),
    },
    {
      label: "Help",
      icon: icons.help,
      action: () => {
        const width = 400;
        const height = 300;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          "https://redmine.ntq.solutions/help/en/wiki_syntax.html",
          "_blank",
          `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
        );
      },
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChangeText?.(e.target.value);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectionStart(e.target.selectionStart ?? 0);
    setSelectionEnd(e.target.selectionEnd ?? 0);
  };
  return (
    <>
      <div className="ml-2" style={{ width: "calc(100% - 225px)" }}>
        <div className="pb-1.5 flex items-center gap-1">
          {itemToolbar.map((item) => {
            return (
              <button
                key={item.label}
                type="button"
                className="border bg-[#f7f7f7] hover:bg-[#e5e5e5] w-6 h-6 flex items-center justify-center"
                onClick={item.action}
              >
                <img src={item.icon} alt={item.label} className="" />
              </button>
            );
          })}
        </div>

        <Controller
          name={name ?? "description"}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              ref={textareaRef}
              className="border w-full h-36 px-1 text-sm font-mono"
              value={text}
              onChange={(e) => {
                field.onChange(e);
                handleChange(e);
              }}
              onSelect={handleSelect}
            ></textarea>
          )}
        />
      </div>
    </>
  );
};

export default Editor;
