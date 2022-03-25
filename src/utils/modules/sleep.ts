
// async/await 睡眠

type TSleep = (time: 200 | number) => Promise<void>;

export const sleep: TSleep = (time = 200) => {
    return new Promise((rel) => {
        setTimeout(() => {
            rel();
        }, time);
    });
};

// sleep(1000)

