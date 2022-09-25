import GamePage from "../GamePage";


export default function HomePage() {
    return (
        <div>
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8 flex flex-col gap-10">
                <header>

                    <div className="sm:justify-between sm:items-center sm:flex">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Dicover Games!
                            </h1>
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-3 gap-4">
                    <GamePage />
                    <GamePage />
                    <GamePage />
                </div>


            </div>







        </div>
    );
}