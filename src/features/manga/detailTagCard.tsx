
interface Props {

}

export default function Tag({ children }: any) {
    return (
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
            {children}
        </span>
    )
}