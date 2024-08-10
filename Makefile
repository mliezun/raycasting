example:
	g++ quickcg.cpp raycaster_flat.cpp -I/usr/local/include/SDL -D_THREAD_SAFE -L/usr/local/lib -lSDLmain -lSDL -Wl,-framework,Cocoa -O3 -W -Wall -ansi -pedantic -o example

example_textured:
	g++ quickcg.cpp raycaster_textured.cpp -I/usr/local/include/SDL -D_THREAD_SAFE -L/usr/local/lib -lSDLmain -lSDL -Wl,-framework,Cocoa -O3 -W -Wall -ansi -pedantic -o example

example_floor:
	g++ quickcg.cpp raycaster_floor.cpp -I/usr/local/include/SDL -D_THREAD_SAFE -L/usr/local/lib -lSDLmain -lSDL -Wl,-framework,Cocoa -O3 -W -Wall -ansi -pedantic -o example

example_sprites:
	g++ quickcg.cpp raycaster_sprites.cpp -I/usr/local/include/SDL -D_THREAD_SAFE -L/usr/local/lib -lSDLmain -lSDL -Wl,-framework,Cocoa -O3 -W -Wall -ansi -pedantic -o example
