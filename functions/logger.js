class Log {
    static type = ["primary", "success", "warn", "error", "info"];
    static instance = null;

    static typeColor(type = "default") {
        let color = "";
        switch (type) {
            case "primary":
                color = "#2d8cf0";
                break;
            case "success":
                color = "#19be6b";
                break;
            case "info":
                color = "#909399";
                break;
            case "warn":
                color = "#ff9900";
                break;
            case "error":
                color = "#f03f14";
                break;
            case "default":
                color = "#35495E";
                break;
            default:
                color = type;
                break;
        }
        return color;
    }

    static print(text, type = "default", back = false) {
        if (typeof text === "object") {
            // 如果是對象則調用打印對象方式
            console.dir(text);
            return;
        }
        if (back) {
            // 如果是打印帶背景圖的
            console.log(`%c ${text} `, `background:${this.typeColor(type)}; padding: 2px; border-radius: 4px; color: #fff;`);
        } else {
            console.log(
                `%c ${text} `,
                `border: 1px solid ${this.typeColor(type)};
        padding: 2px; border-radius: 4px;
        color: ${this.typeColor(type)};`
            );
        }
    }

    static pretty(type = "primary", title, ...text) {
        if (text.length <= 1) {
            const info = text[0];
            if (typeof info === "object") {
                console.group("Console Group", title);
                console.log(
                    `%c ${title}`,
                    `background:${this.typeColor(type)};border:1px solid ${this.typeColor(type)};
        padding: 1px; border-radius: 4px; color: #fff;`
                );
                console.dir(info);
                console.groupEnd();
                return;
            }
            console.log(
                `%c ${title} %c ${info} %c`,
                `background:${this.typeColor(type)};border:1px solid ${this.typeColor(type)};
      padding: 1px; border-radius: 4px 0 0 4px; color: #fff;`,
                `border:1px solid ${this.typeColor(type)};
      padding: 1px; border-radius: 0 4px 4px 0; color: ${this.typeColor(type)};`,
                "background:transparent"
            );
        } else {
            console.group("Console Group", title);
            console.log(
                `%c ${title}`,
                `background:${this.typeColor(type)};border:1px solid ${this.typeColor(type)};
        padding: 1px; border-radius: 4px; color: #fff;`
            );
            text.forEach(info => {
                console.dir(info);
            });
            console.groupEnd();
        }
    }

    static getInstance() {
        if (this.instance === null) {
            this.instance = new Log();
        }
        return this.instance;
    }
}
export default Log.getInstance();
