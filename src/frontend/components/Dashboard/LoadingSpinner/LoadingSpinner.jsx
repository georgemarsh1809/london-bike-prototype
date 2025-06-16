export const LoadingSpinner = ({ display }) => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 50 50"
        style={{ margin: 'auto', display: { display } }}
    >
        <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#f5f5f5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
            transform="rotate(0 25 25)"
        >
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1.5s"
                repeatCount="indefinite"
            />
        </circle>
    </svg>
);
